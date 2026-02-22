/**
 * AlignED Article 001 — Chart Rendering Module
 *
 * Loads benchmark data from per-eval JSON files and renders Chart.js charts
 * within Article 1 (the consolidated benchmark paper). Each evaluation has
 * its own data file and model pool. There is no composite score.
 *
 * Page detection uses document.body.dataset.page to determine whether to
 * render charts. Only renders when data-page="article-001".
 */

/* ── Provider color mapping ── */
const PROVIDER_COLORS = {
  'Anthropic': '#D97757',
  'OpenAI':    '#10A37F',
  'Google':    '#4285F4',
  'Meta':      '#0668E1',
  'DeepSeek':  '#536DFE',
  'Mistral':   '#F97316'
};

/**
 * Returns the brand color for a given provider name.
 * Falls back to grey if the provider is unknown.
 *
 * @param {string} provider - Provider name (e.g. "Anthropic")
 * @returns {string} Hex color code
 */
function getProviderColor(provider) {
  return PROVIDER_COLORS[provider] || '#6B7280';
}

/* ── Data loaders ── */

/**
 * Fetches and parses the neuromyths scores JSON file.
 *
 * @returns {Promise<Array>} Array of neuromyth result objects
 */
async function loadNeuromythsData() {
  var response = await fetch('data/neuromyths_scores.json');
  var json = await response.json();
  return json.results;
}

/**
 * Fetches and parses the scenarios scores JSON file.
 *
 * @returns {Promise<Array>} Array of scenario result objects
 */
async function loadScenariosData() {
  var response = await fetch('data/scenarios_scores.json');
  var json = await response.json();
  return json.results;
}

/**
 * Fetches and parses the pedagogy scores JSON file.
 *
 * @returns {Promise<Array>} Array of pedagogy result objects
 */
async function loadPedagogyData() {
  var response = await fetch('data/pedagogy_scores.json');
  var json = await response.json();
  return json.results;
}

/**
 * Fetches and parses the ACARA comparative judgement scores JSON file.
 *
 * @returns {Promise<Array>} Array of ACARA CJ result objects
 */
async function loadAcaraData() {
  var response = await fetch('data/acara_scores.json');
  var json = await response.json();
  return json.results;
}

/**
 * Fetches and parses the ACARA standards-based grading scores JSON file.
 *
 * @returns {Promise<Array>} Array of ACARA SG result objects
 */
async function loadAcaraSgData() {
  var response = await fetch('data/acara_standards_grading_scores.json');
  var json = await response.json();
  return json.results;
}

/**
 * Fetches and parses the model metadata JSON file (release dates, costs, tokens).
 *
 * @returns {Promise<Array>} Array of model metadata objects
 */
async function loadModelMetadata() {
  var response = await fetch('data/model_metadata.json');
  var json = await response.json();
  return json.models;
}

/* ── Chart rendering functions ── */

/**
 * Renders a vertical bar chart showing all models for a given metric.
 *
 * @param {string} canvasId - The id of the <canvas> element
 * @param {Array} data - Array of model objects
 * @param {string} metric - The field name to chart (e.g. "score_pct")
 * @param {string} label - Human-readable axis label
 * @param {Object} options - Optional overrides (e.g. { yMin: 0 })
 */
function renderAllModelsChart(canvasId, data, metric, label, options) {
  options = options || {};
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;

  /* Sort by the chosen metric descending */
  var sorted = data.slice()
    .filter(function(m) { return m[metric] != null; })
    .sort(function(a, b) { return b[metric] - a[metric]; });

  var labels = sorted.map(function(m) { return m.model; });
  var values = sorted.map(function(m) { return m[metric]; });
  var colors = sorted.map(function(m) { return getProviderColor(m.provider); });

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderRadius: 4,
        barPercentage: 0.85
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) { return ctx.raw.toFixed(1) + '%'; }
          }
        }
      },
      scales: {
        y: {
          min: options.yMin != null ? options.yMin : 50,
          max: 100,
          grid: { color: '#E8E4DF' },
          ticks: {
            callback: function(v) { return v + '%'; },
            font: { size: 11 }
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 9 },
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
}

/**
 * Renders a grouped bar chart for ACARA CJ results showing accuracy
 * and reliability side by side for each model.
 *
 * @param {string} canvasId - The id of the <canvas> element
 * @param {Array} data - Array of ACARA CJ result objects
 */
function renderAcaraChart(canvasId, data) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;

  var sorted = data.slice().sort(function(a, b) { return b.accuracy - a.accuracy; });

  var labels = sorted.map(function(m) { return m.model; });
  var accuracyValues = sorted.map(function(m) { return m.accuracy; });
  var reliabilityValues = sorted.map(function(m) { return m.reliability; });
  var barColors = sorted.map(function(m) { return getProviderColor(m.provider); });

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Accuracy',
          data: accuracyValues,
          backgroundColor: barColors,
          borderRadius: 4,
          barPercentage: 0.8
        },
        {
          label: 'Position-Swap Consistency',
          data: reliabilityValues,
          backgroundColor: barColors.map(function(c) { return c + '80'; }),
          borderRadius: 4,
          barPercentage: 0.8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { font: { size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ctx.dataset.label + ': ' + ctx.raw.toFixed(1) + '%';
            }
          }
        }
      },
      scales: {
        y: {
          min: 50,
          max: 100,
          grid: { color: '#E8E4DF' },
          ticks: {
            callback: function(v) { return v + '%'; },
            font: { size: 11 }
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 9 },
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
}

/**
 * Renders a grouped bar chart for ACARA Standards-Based Grading results.
 *
 * @param {string} canvasId - The id of the <canvas> element
 * @param {Array} data - Array of ACARA SG result objects
 */
function renderAcaraSgChart(canvasId, data) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;

  var sorted = data.slice().sort(function(a, b) { return b.overall_accuracy - a.overall_accuracy; });

  var labels = sorted.map(function(m) { return m.model; });

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Above Satisfactory',
          data: sorted.map(function(m) { return m.above_sat_accuracy; }),
          backgroundColor: '#EF4444',
          borderRadius: 4,
          barPercentage: 0.8
        },
        {
          label: 'Satisfactory',
          data: sorted.map(function(m) { return m.sat_accuracy; }),
          backgroundColor: '#F59E0B',
          borderRadius: 4,
          barPercentage: 0.8
        },
        {
          label: 'Below Satisfactory',
          data: sorted.map(function(m) { return m.below_sat_accuracy; }),
          backgroundColor: '#10B981',
          borderRadius: 4,
          barPercentage: 0.8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { font: { size: 11 } }
        },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ctx.dataset.label + ': ' + ctx.raw.toFixed(1) + '%';
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: '#E8E4DF' },
          ticks: {
            callback: function(v) { return v + '%'; },
            font: { size: 11 }
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 9 },
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
}

/**
 * Renders a scatter/timeline chart showing model release dates on the X axis
 * and a score metric on the Y axis.
 *
 * @param {string} canvasId - The id of the <canvas> element
 * @param {Array} scoreData - Array of model objects with the score metric
 * @param {string} scoreField - The field name for the Y axis value
 * @param {string} yLabel - Human-readable Y axis label
 * @param {Array} metadataArr - Array of model metadata objects with release_date
 */
function renderTimelineChart(canvasId, scoreData, scoreField, yLabel, metadataArr) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;

  /* Build a lookup from model name to metadata */
  var metaMap = {};
  metadataArr.forEach(function(m) { metaMap[m.model] = m; });

  /* Build scatter data points */
  var points = [];
  scoreData.forEach(function(m) {
    var meta = metaMap[m.model];
    if (!meta || !meta.release_date || m[scoreField] == null) return;

    var parts = meta.release_date.split('-');
    var dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 15);

    points.push({
      x: dateObj.getTime(),
      y: m[scoreField],
      model: m.model,
      provider: m.provider,
      color: getProviderColor(m.provider)
    });
  });

  points.sort(function(a, b) { return a.x - b.x; });

  new Chart(canvas, {
    type: 'scatter',
    data: {
      datasets: [{
        data: points.map(function(p) { return { x: p.x, y: p.y }; }),
        backgroundColor: points.map(function(p) { return p.color; }),
        borderColor: points.map(function(p) { return p.color; }),
        pointRadius: 7,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: function(items) {
              var idx = items[0].dataIndex;
              return points[idx].model;
            },
            label: function(ctx) {
              var idx = ctx.dataIndex;
              var d = new Date(points[idx].x);
              var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
              return [
                points[idx].provider,
                monthNames[d.getMonth()] + ' ' + d.getFullYear(),
                'Score: ' + points[idx].y.toFixed(1) + '%'
              ];
            }
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'quarter',
            displayFormats: { quarter: 'MMM yyyy' }
          },
          title: { display: true, text: 'Release Date', font: { size: 12 } },
          grid: { color: '#E8E4DF' }
        },
        y: {
          min: 50,
          max: 95,
          title: { display: true, text: yLabel, font: { size: 12 } },
          grid: { color: '#E8E4DF' },
          ticks: {
            callback: function(v) { return v + '%'; },
            font: { size: 11 }
          }
        }
      }
    }
  });
}

/**
 * Renders a horizontal bar chart showing token usage per model.
 *
 * @param {string} canvasId - The id of the <canvas> element
 * @param {Array} metadataArr - Array of model metadata objects with survey_scenario_tokens
 */
function renderTokenChart(canvasId, metadataArr) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;

  var withTokens = metadataArr
    .filter(function(m) { return m.survey_scenario_tokens != null; })
    .sort(function(a, b) { return b.survey_scenario_tokens - a.survey_scenario_tokens; });

  var labels = withTokens.map(function(m) { return m.model; });
  var values = withTokens.map(function(m) { return m.survey_scenario_tokens; });
  var colors = withTokens.map(function(m) { return getProviderColor(m.provider); });

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Tokens (Survey + Scenarios)',
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(function(c) { return c + 'CC'; }),
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 20,
        categoryPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              return ctx.raw.toLocaleString() + ' tokens';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: '#E8E4DF' },
          ticks: {
            callback: function(v) { return (v / 1000).toFixed(0) + 'k'; },
            font: { size: 11 }
          },
          title: { display: true, text: 'Total Tokens', font: { size: 12 } }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 10 } }
        }
      }
    }
  });
}

/* ── Page initialisation ── */
document.addEventListener('DOMContentLoaded', async function() {
  /* Only render charts on Article 001 */
  var page = document.body.dataset.page;
  if (page !== 'article-001') return;

  try {
    /* Load all per-eval data files in parallel */
    var results = await Promise.all([
      loadNeuromythsData(),
      loadScenariosData(),
      loadPedagogyData(),
      loadAcaraData(),
      loadAcaraSgData(),
      loadModelMetadata()
    ]);

    var neuromythsData = results[0];
    var scenariosData = results[1];
    var pedagogyData = results[2];
    var acaraData = results[3];
    var acaraSgData = results[4];
    var metadata = results[5];

    /* Neuromyth identification (31 models) */
    renderAllModelsChart('neuromythsChart', neuromythsData, 'score_pct', 'Neuromyth Identification');

    /* Diagnostic reasoning (30 models) */
    renderAllModelsChart('scenariosChart', scenariosData, 'score_pct', 'Diagnostic Reasoning');

    /* Teacher certification knowledge (23 models) */
    renderAllModelsChart('cdpkChart', pedagogyData, 'pedagogy_cdpk_pct', 'General Pedagogical Knowledge');
    renderAllModelsChart('sendChart', pedagogyData, 'pedagogy_send_pct', 'Inclusive Education');

    /* ACARA comparative judgement (12 models) */
    renderAcaraChart('acaraChart', acaraData);

    /* ACARA standards-based grading pilot (7 models) */
    renderAcaraSgChart('acaraSgChart', acaraSgData);

    /* Token usage chart */
    renderTokenChart('tokenChart', metadata);

    /* Timeline chart using pedagogy total score */
    renderTimelineChart(
      'timelineChart',
      pedagogyData,
      'pedagogy_total_pct',
      'Teacher Certification Knowledge (%)',
      metadata
    );
  } catch (error) {
    console.error('Failed to load chart data:', error);
  }
});
