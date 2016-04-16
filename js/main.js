//From the original

// Step 1: Load data
var startHere = function() {

    // async data load
    queue()
        .defer(d3.csv, "/cs171/data/total_population_1925_2012.csv")
        .defer(d3.csv, "/cs171/data/states.csv")
        .defer(d3.csv, "/cs171/data/by_state_by_gender.csv")
        .defer(d3.csv, "/cs171/data/by_state_by_race.csv")
        .defer(d3.csv, "/cs171/data/total_percent_offenses.csv")
        .defer(d3.csv, "/cs171/data/executions.csv")
        .defer(d3.csv, "/cs171/data/international_rates.csv")
        .defer(d3.csv, "/cs171/data/sexual_harassment_demographics.csv")
        .await(dataLoaded);
}

// Step 2: wrangle data
var dataLoaded = function(error, _totalPopulation, _states, _byStateByGender, _byStateByRace, _offenses, _executions, _international, _sexualHarassment) {
    // report loading errors
    if (error) console.log("DATA LOAD ERROR (" + error.status + "): " + error.statusText);

    // keys between state and abbrev
    states = _states.map(function(d) {
        return {
            id: parseInt(d.id),
            name: d.name,
            abbrev: d.abbreviation,
            region: d.census_region_name, // i.e. "South"
            population: parse(d.population)
        }
    });

    // fill perYear info
    totalPopulation = _totalPopulation.map(function(d) {
        return {
            year: parseInt(d.year),
            population: parseInt(d.population)
        };
    });

    // offenses
    var categories = ["white", "hispanic", "other", "black", "male", "female"];
    var total_raw = _offenses[_offenses.length - 1];

    offenses = [];
    for (var key in total_raw) {
        if (categories.indexOf(key) > -1)
        {
            offenses.push({
                type: key,
                total: parseInt(total_raw[key]),
                values: {}
            });
        }
    };

    _offenses.filter(function(e) { return e.subcategory == ""; }).map(function(d) {
        for (var key in d) {
            if (categories.indexOf(key) > -1) {
                var blah = offenses.filter(function(e) { return e.type == key; })[0];
                blah.values[d.category] = (parseFloat(d[key]) / 100) * blah.total;
            }
        }
    });

    // executions
    executions = _executions.slice(1,3).map(function(d) {
        var vals = d3.keys(d).filter(function(e) { return e !== "region" && e !== "total"; }).map(function(year) {
            return {
                year: parseInt(year),
                amount: d[year]
            }
        });

        return {
            type: $.trim(d.region),
            values: vals
        };
    });

    executions_by_state = _executions.slice(3).map(function(d) {
        var vals = d3.keys(d).filter(function(e) { return e !== "region" && e !== "total"; }).map(function(year) {
            return {
                year: parseInt(year),
                amount: d[year]
            }
        });

        var abbrev = states.filter(function(e) {
            return e.name == $.trim(d.region);
        });

        if (abbrev.length > 0)
            abbrev = abbrev[0].abbrev;
        else
            abbrev = $.trim(d.region);

        return {
            state: abbrev,
            values: vals
        };
    });

    // extract the overall stats - national, federal, state
    byStateByGender = _byStateByGender.map(function(d) {
        return {
            state: d["Jurisdiction"],
            2012: { "total": parse(d["2012Total"]), "male": parse(d["2012Male"]), "female": parse(d["2012Female"]) },
            2013: { "total": parse(d["2013Total"]), "male": parse(d["2013Male"]), "female": parse(d["2013Female"]) },
            delta: { "total": parseFloat(d["ChangeTotal"]), "male": parseFloat(d["ChangeMale"]), "female": parseFloat(d["ChangeFemale"]) }
        }
    });

    // split by overall stats (US, federal, state) and state statistics (the rest)
    byStateByRace = _byStateByRace.map(function(d) {
        return {
            state: d.state,
            white: parseInt(d.white),
            hispanic: parseInt(d.hispanic),
            black: parseInt(d.black),
            AI: parseInt(d.AI)
        };
    });

    // international (top 20 countries for total prisoners) statistics
    international = _international.map(function(d) {
        return {
            country: d.country,					// country name
            total: parseInt(d.total),			// total police personnel (to be divided )
            female: parseFloat(d.female),		// female prisoners (percentage of prison population)
            gdppc: parseInt(d.gdppc),			// gdp per capita
            poverty: parseFloat(d.poverty),		// poverty rate
            life: parseFloat(d.life), 			// life expectancy
            literacy: parseFloat(d.literacy),	// literacy rate
            population: parseInt(d.population)	// total population
        };
    });

    // sexual harassment
    sexual_harassment = _sexualHarassment.map(function(d) {
        return {
            category: d.category,
            characteristic: d.characteristic,
            type: d.type,
            heterosexual: parseFloat(d.heterosexual),
            non_heterosexual: parseFloat(d["non-heterosexual"])
        }
    });

    initAllVis();

}

// Step 3: initialize all visualizations
var initAllVis = function() {

    // Instantiate event handlers
    var mapEH = new Object(); // handle map selection

    // Instantiate vis objects
    var execution_vis = new ExecutionVis(d3.select("#executionVis"), executions);
    var execution_map_vis = new ExecutionMapVis(d3.select("#executionMapVis"), executions_by_state);
    var time_vis = new TimeVis(d3.select("#timeVis"), totalPopulation);
    var map_vis = new MapVis(d3.select("#mapVis"), states, mapEH);
    var offense_vis_gender = null;
    var offense_vis_race = null;
    var breakdown_vis = new BreakdownVis(d3.select("#breakdownVis"), byStateByGender, byStateByRace, states);
    var international_vis = null;
    var sexual_harassment_vis = new SexualHarassmentVis(d3.select("#sexualHarassmentVis"), sexual_harassment);

    // Bind event handlers
    checkScrolls();

    $(mapEH).bind("selectionChanged", function(event, data){
        breakdown_vis.onSelectionChange(data); // e.g., state = "Alabama"
    });

    $('.map-box input').click(function() {
        breakdown_vis.onSelectionChange();
    });

    $("#slider").on("input", function(e) {
        execution_map_vis.onSelectionChange(this.value);
    });

    $("#sexualHarassmentVis .category input").on("click", function(e) {
        sexual_harassment_vis.onSelectionChange("category", $(this).attr("data-b"));
    });

    $("#sexualHarassmentVis .type input").on("click", function(e) {
        sexual_harassment_vis.onSelectionChange("type", $(this).attr("data-b"));
    });

    $(window).scroll(function() {
        checkScrolls();
    });

    function checkScrolls() {
        if (isScrolledIntoView("#executionVis") && execution_vis) {
            execution_vis.onSelectionChange();
        }
        if (isScrolledIntoView("#offenseVisGender") && !offense_vis_gender) {
            offense_vis_gender = new OffenseVis(d3.select("#offenseVisGender"), offenses.slice(0,2));
        }
        if (isScrolledIntoView("#offenseVisRace") && !offense_vis_race) {
            offense_vis_race = new OffenseVis(d3.select("#offenseVisRace"), offenses.slice(2), true);
        }
        if (isScrolledIntoView("#internationalVis") && !international_vis) {
            international_vis = new InternationalVis(d3.select("#internationalVis"), international);
        }
    }

    // page tabbing
    $(function() {
        $('a[href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                console.log($(this.hash));
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - $('#navbar').height()
                    }, 1000);
                    return false;
                }
                checkScrolls();
            }
        });
    });
}



startHere();




// helper function for parsing integer strings with commas
var parse = function(input) {
    return parseInt(input.replace(/,/g,''));
}

function isScrolledIntoView(elem)
{
    var $elem = $(elem);
    var $window = $(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

$(".cool-btns input").click(function(e) {
    $(this).siblings().removeClass("active");
    $(this).addClass("active")
});


