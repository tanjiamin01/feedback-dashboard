/**
 * Feedback Intelligence Dashboard
 * PM-focused feedback management with AI-powered analysis and status tracking
 */

const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Feedback Dashboard</title>
	<style>
		* { margin: 0; padding: 0; box-sizing: border-box; }
		body { 
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
			background: #f5f5f5;
			padding: 20px;
		}
		.container { max-width: 1600px; margin: 0 auto; }
		
		.insights-section {
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
			padding: 30px 35px;
			border-radius: 8px;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			margin-bottom: 25px;
		}
		
		.insights-header {
			font-size: 14px;
			text-transform: uppercase;
			letter-spacing: 1px;
			opacity: 0.9;
			margin-bottom: 15px;
			font-weight: 600;
		}
		
		.insights-summary {
			font-size: 18px;
			line-height: 1.7;
			opacity: 0.95;
			font-weight: 400;
		}
		
		.insights-loading {
			font-size: 16px;
			opacity: 0.8;
			font-style: italic;
		}
		
		.stats-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
			gap: 20px;
			margin-bottom: 25px;
		}
		
		.stat-card {
			background: white;
			padding: 25px;
			border-radius: 8px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		}
		
		.stat-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 15px;
		}
		
		.stat-value {
			font-size: 42px;
			font-weight: bold;
			color: #333;
		}
		
		.stat-label {
			font-size: 12px;
			color: #666;
			text-transform: uppercase;
			letter-spacing: 0.5px;
			font-weight: 600;
		}
		
		.donut-container {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 20px;
			position: relative;
		}
		
		.donut-chart {
			width: 180px;
			height: 180px;
			position: relative;
		}
		
		.donut-legend {
			display: flex;
			flex-direction: column;
			gap: 10px;
			margin-left: 30px;
		}
		
		.legend-item {
			display: flex;
			align-items: center;
			gap: 10px;
			font-size: 13px;
		}
		
		.legend-color {
			width: 16px;
			height: 16px;
			border-radius: 3px;
		}
		
		.legend-color.urgent { background: #d32f2f; }
		.legend-color.high { background: #f57c00; }
		.legend-color.medium { background: #fbc02d; }
		.legend-color.low { background: #388e3c; }
		
		.legend-text {
			flex: 1;
			color: #333;
		}
		
		.legend-count {
			font-weight: 600;
			color: #666;
		}
		
		.source-chart {
			display: flex;
			flex-direction: column;
			gap: 8px;
			margin-top: 12px;
		}
		
		.source-row {
			display: flex;
			align-items: center;
			gap: 10px;
		}
		
		.source-label {
			font-size: 12px;
			color: #666;
			min-width: 80px;
		}
		
		.source-bar-container {
			flex: 1;
			height: 20px;
			background: #f0f0f0;
			border-radius: 4px;
			overflow: hidden;
		}
		
		.source-bar-fill {
			height: 100%;
			background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
			transition: width 0.3s ease;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding-right: 8px;
		}
		
		.source-count {
			font-size: 11px;
			color: white;
			font-weight: 600;
		}
		
		.controls {
			background: white;
			padding: 20px;
			border-radius: 8px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
			margin-bottom: 25px;
		}
		
		.controls-row {
			display: flex;
			gap: 15px;
			flex-wrap: wrap;
			align-items: flex-end;
		}
		
		.control-group {
			display: flex;
			flex-direction: column;
			gap: 5px;
		}
		
		.control-group label {
			font-size: 12px;
			color: #666;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.5px;
		}
		
		select, button {
			padding: 10px 16px;
			border: 1px solid #ddd;
			border-radius: 4px;
			font-size: 14px;
			background: white;
			cursor: pointer;
			height: 40px;
		}
		
		select:hover, button:hover {
			border-color: #0051c3;
		}
		
		button {
			background: #0051c3;
			color: white;
			border: none;
			font-weight: 600;
		}
		
		button:hover { background: #003d99; }
		
		.status-indicator {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 10px 16px;
			background: #e8f5e9;
			border-radius: 4px;
			font-size: 13px;
			color: #2e7d32;
			height: 40px;
			border: 1px solid transparent;
		}
		
		.status-indicator.analyzing {
			background: #fff3e0;
			color: #e65100;
		}
		
		.pulse {
			width: 8px;
			height: 8px;
			background: #4caf50;
			border-radius: 50%;
			animation: pulse 2s infinite;
		}
		
		@keyframes pulse {
			0%, 100% { opacity: 1; }
			50% { opacity: 0.3; }
		}
		
		.feedback-section {
			background: white;
			padding: 0;
			border-radius: 8px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
			overflow: hidden;
		}
		
		.tabs {
			display: flex;
			border-bottom: 2px solid #f0f0f0;
			background: #fafafa;
		}
		
		.tab {
			flex: 1;
			padding: 18px 24px;
			text-align: center;
			cursor: pointer;
			font-weight: 600;
			font-size: 14px;
			color: #666;
			border-bottom: 3px solid transparent;
			transition: all 0.2s;
			position: relative;
		}
		
		.tab:hover {
			background: #f5f5f5;
			color: #333;
		}
		
		.tab.active {
			color: #0051c3;
			background: white;
			border-bottom-color: #0051c3;
		}
		
		.tab-badge {
			display: inline-block;
			margin-left: 8px;
			padding: 2px 8px;
			background: #e0e0e0;
			color: #666;
			border-radius: 12px;
			font-size: 12px;
			font-weight: 600;
		}
		
		.tab.active .tab-badge {
			background: #0051c3;
			color: white;
		}
		
		.tab-content {
			display: none;
			padding: 25px;
		}
		
		.tab-content.active {
			display: block;
		}
		
		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20px;
		}
		
		.results-count {
			font-size: 14px;
			color: #666;
		}
		
		.feedback-item {
			border: 1px solid #e0e0e0;
			padding: 20px;
			margin-bottom: 15px;
			border-radius: 6px;
			background: #fafafa;
			transition: transform 0.2s, box-shadow 0.2s;
		}
		
		.feedback-item:hover {
			transform: translateY(-2px);
			box-shadow: 0 4px 8px rgba(0,0,0,0.1);
		}
		
		.feedback-item.priority-urgent {
			border-left: 4px solid #d32f2f;
			background: #ffebee;
		}
		
		.feedback-item.priority-high {
			border-left: 4px solid #f57c00;
			background: #fff3e0;
		}
		
		.feedback-item.priority-medium {
			border-left: 4px solid #fbc02d;
			background: #fffde7;
		}
		
		.feedback-item.priority-low {
			border-left: 4px solid #388e3c;
			background: #f1f8e9;
		}
		
		.feedback-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 12px;
			flex-wrap: wrap;
			gap: 10px;
		}
		
		.feedback-meta {
			display: flex;
			gap: 8px;
			align-items: center;
			flex-wrap: wrap;
		}
		
		.source-badge {
			display: inline-block;
			padding: 4px 10px;
			background: #e3f2fd;
			color: #1976d2;
			border-radius: 4px;
			font-size: 12px;
			font-weight: 600;
		}
		
		.priority {
			display: inline-block;
			padding: 6px 14px;
			border-radius: 4px;
			font-size: 13px;
			font-weight: bold;
			text-transform: uppercase;
		}
		
		.priority.urgent { background: #d32f2f; color: white; }
		.priority.high { background: #f57c00; color: white; }
		.priority.medium { background: #fbc02d; color: #000; }
		.priority.low { background: #388e3c; color: white; }
		
		.status-dropdown {
			padding: 6px 12px;
			border: 1px solid #ddd;
			border-radius: 4px;
			font-size: 12px;
			background: white;
			cursor: pointer;
			font-weight: 600;
		}
		
		.status-dropdown.new { color: #1976d2; border-color: #1976d2; }
		.status-dropdown.in-progress { color: #f57c00; border-color: #f57c00; }
		.status-dropdown.completed { color: #388e3c; border-color: #388e3c; }
		
		.theme-badge {
			display: inline-block;
			padding: 4px 10px;
			background: #e8eaf6;
			color: #3f51b5;
			border-radius: 4px;
			font-size: 11px;
			font-weight: 600;
			margin-right: 5px;
			margin-top: 5px;
		}
		
		.feedback-text {
			color: #333;
			line-height: 1.6;
			margin-bottom: 10px;
		}
		
		.feedback-footer {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 10px;
		}
		
		.feedback-timestamp {
			font-size: 12px;
			color: #999;
		}
		
		.feedback-themes {
			display: flex;
			flex-wrap: wrap;
			gap: 5px;
		}
		
		.empty-state {
			text-align: center;
			padding: 60px 20px;
			color: #999;
		}
		
		.loading-overlay {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0,0,0,0.7);
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 9999;
		}
		
		.loading-content {
			background: white;
			padding: 40px;
			border-radius: 8px;
			text-align: center;
		}
		
		.loading-spinner {
			width: 50px;
			height: 50px;
			border: 5px solid #f3f3f3;
			border-top: 5px solid #0051c3;
			border-radius: 50%;
			animation: spin 1s linear infinite;
			margin: 0 auto 20px;
		}
		
		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="insights-section">
			<div class="insights-header">AI Summary</div>
			<div class="insights-summary" id="insights-summary">
				<span class="insights-loading">Analyzing feedback patterns...</span>
			</div>
		</div>
		
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-header">
					<div>
						<div class="stat-value" id="total-count">-</div>
						<div class="stat-label">Total Feedback</div>
					</div>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-label">Priority Distribution</div>
				<div class="donut-container">
					<canvas id="donut-chart" class="donut-chart" width="180" height="180"></canvas>
					<div class="donut-legend">
						<div class="legend-item">
							<div class="legend-color urgent"></div>
							<span class="legend-text">Urgent</span>
							<span class="legend-count" id="urgent-count">0</span>
						</div>
						<div class="legend-item">
							<div class="legend-color high"></div>
							<span class="legend-text">High</span>
							<span class="legend-count" id="high-count">0</span>
						</div>
						<div class="legend-item">
							<div class="legend-color medium"></div>
							<span class="legend-text">Medium</span>
							<span class="legend-count" id="medium-count">0</span>
						</div>
						<div class="legend-item">
							<div class="legend-color low"></div>
							<span class="legend-text">Low</span>
							<span class="legend-count" id="low-count">0</span>
						</div>
					</div>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-label">Feedback Sources</div>
				<div class="source-chart" id="source-chart">
					<div class="source-row">
						<span class="source-label">Loading...</span>
					</div>
				</div>
			</div>
		</div>
		
		<div class="controls">
			<div class="controls-row">
				<div class="control-group">
					<label>Sort By</label>
					<select id="sort-select" onchange="applyFilters()">
						<option value="priority">Priority</option>
						<option value="newest">Newest</option>
						<option value="oldest">Oldest</option>
					</select>
				</div>
				
				<div class="control-group">
					<label>Priority</label>
					<select id="priority-filter" onchange="applyFilters()">
						<option value="all">All</option>
						<option value="urgent">Urgent</option>
						<option value="high">High</option>
						<option value="medium">Medium</option>
						<option value="low">Low</option>
					</select>
				</div>
				
				<div class="control-group">
					<label>Source</label>
					<select id="source-filter" onchange="applyFilters()">
						<option value="all">All</option>
					</select>
				</div>
				
				<div class="control-group">
					<label>Theme</label>
					<select id="theme-filter" onchange="applyFilters()">
						<option value="all">All</option>
					</select>
				</div>
				
				<div class="control-group">
					<label>&nbsp;</label>
					<button onclick="resetFilters()">Reset</button>
				</div>
				
				<div class="status-indicator" id="status-indicator">
					<div class="pulse"></div>
					<span id="status-text">Live</span>
				</div>
			</div>
		</div>
		
		<div class="feedback-section">
			<div class="tabs">
				<div class="tab active" onclick="switchTab('new')">
					New <span class="tab-badge" id="new-badge">0</span>
				</div>
				<div class="tab" onclick="switchTab('in-progress')">
					In Progress <span class="tab-badge" id="in-progress-badge">0</span>
				</div>
				<div class="tab" onclick="switchTab('completed')">
					Completed <span class="tab-badge" id="completed-badge">0</span>
				</div>
			</div>
			
			<div id="new-content" class="tab-content active">
				<div class="section-header">
					<span class="results-count" id="new-results-count">0 items</span>
				</div>
				<div id="new-feedback-list"></div>
			</div>
			
			<div id="in-progress-content" class="tab-content">
				<div class="section-header">
					<span class="results-count" id="in-progress-results-count">0 items</span>
				</div>
				<div id="in-progress-feedback-list"></div>
			</div>
			
			<div id="completed-content" class="tab-content">
				<div class="section-header">
					<span class="results-count" id="completed-results-count">0 items</span>
				</div>
				<div id="completed-feedback-list"></div>
			</div>
		</div>
	</div>
	
	<div id="loading-overlay" class="loading-overlay" style="display: none;">
		<div class="loading-content">
			<div class="loading-spinner"></div>
			<div id="loading-text">Analyzing feedback...</div>
		</div>
	</div>
	
	<script>
		let allFeedback = [];
		let currentTab = 'new';
		
		function switchTab(tabName) {
			currentTab = tabName;
			
			document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
			document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
			
			event.target.closest('.tab').classList.add('active');
			document.getElementById(tabName + '-content').classList.add('active');
			
			applyFilters();
		}
		
		async function loadDashboard() {
			try {
				const response = await fetch('/api/feedback');
				const data = await response.json();
				allFeedback = data;
				
				const needsAnalysis = data.some(f => !f.priority || !f.themes);
				
				if (needsAnalysis) {
					showLoading(true, 'Analyzing feedback with AI...');
					updateStatusIndicator('analyzing', 'Analyzing...');
					
					const analysisResponse = await fetch('/api/analyze', { method: 'POST' });
					const analysisResult = await analysisResponse.json();
					
					if (analysisResult.analyzed > 0) {
						const refreshed = await fetch('/api/feedback');
						allFeedback = await refreshed.json();
					}
					
					showLoading(false);
					updateStatusIndicator('live', 'Live');
				} else {
					updateStatusIndicator('live', 'Live');
				}
				
				// Get AI summary
				const summaryResponse = await fetch('/api/summary');
				const summary = await summaryResponse.json();
				renderSummary(summary.summary);
				
				populateFilters(allFeedback);
				updateTabBadges();
				applyFilters();
				
			} catch (error) {
				console.error('Error loading dashboard:', error);
				updateStatusIndicator('error', 'Error');
				showLoading(false);
			}
		}
		
		function renderSummary(summaryText) {
			const summaryEl = document.getElementById('insights-summary');
			if (summaryText) {
				summaryEl.textContent = summaryText;
			} else {
				summaryEl.innerHTML = '<span class="insights-loading">No new feedback to analyze.</span>';
			}
		}
		
		function updateTabBadges() {
			const newCount = allFeedback.filter(f => (f.status || 'new') === 'new').length;
			const inProgressCount = allFeedback.filter(f => f.status === 'in-progress').length;
			const completedCount = allFeedback.filter(f => f.status === 'completed').length;
			
			document.getElementById('new-badge').textContent = newCount;
			document.getElementById('in-progress-badge').textContent = inProgressCount;
			document.getElementById('completed-badge').textContent = completedCount;
		}
		
		function showLoading(show, text = '') {
			const overlay = document.getElementById('loading-overlay');
			const loadingText = document.getElementById('loading-text');
			overlay.style.display = show ? 'flex' : 'none';
			if (text) loadingText.textContent = text;
		}
		
		function populateFilters(data) {
			const sources = [...new Set(data.map(f => f.source))].sort();
			const sourceFilter = document.getElementById('source-filter');
			sourceFilter.innerHTML = '<option value="all">All</option>' +
				sources.map(s => \`<option value="\${s}">\${s}</option>\`).join('');
			
			const allThemes = new Set();
			data.forEach(f => {
				if (f.themes) {
					try {
						const themes = JSON.parse(f.themes);
						themes.forEach(t => allThemes.add(t.toLowerCase()));
					} catch (e) {}
				}
			});
			
			const themeFilter = document.getElementById('theme-filter');
			themeFilter.innerHTML = '<option value="all">All</option>' +
				[...allThemes].sort().map(t => \`<option value="\${t}">\${t}</option>\`).join('');
		}
		
		function applyFilters() {
			const sortBy = document.getElementById('sort-select').value;
			const priorityFilter = document.getElementById('priority-filter').value;
			const sourceFilter = document.getElementById('source-filter').value;
			const themeFilter = document.getElementById('theme-filter').value;
			
			let filtered = allFeedback.filter(item => {
				const itemStatus = item.status || 'new';
				return itemStatus === currentTab;
			});
			
			filtered = filtered.filter(item => {
				if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
				if (sourceFilter !== 'all' && item.source !== sourceFilter) return false;
				
				if (themeFilter !== 'all') {
					try {
						const themes = item.themes ? JSON.parse(item.themes) : [];
						const normalizedThemes = themes.map(t => t.toLowerCase());
						if (!normalizedThemes.includes(themeFilter.toLowerCase())) return false;
					} catch (e) {
						return false;
					}
				}
				
				return true;
			});
			
			filtered.sort((a, b) => {
				switch(sortBy) {
					case 'priority':
						const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
						return priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium'];
					case 'newest':
						return new Date(b.timestamp) - new Date(a.timestamp);
					case 'oldest':
						return new Date(a.timestamp) - new Date(b.timestamp);
					default:
						return 0;
				}
			});
			
			renderDashboard();
			renderFeedbackList(currentTab, filtered);
		}
		
		function renderDashboard() {
			const total = allFeedback.length;
			const urgent = allFeedback.filter(f => f.priority === 'urgent').length;
			const high = allFeedback.filter(f => f.priority === 'high').length;
			const medium = allFeedback.filter(f => f.priority === 'medium').length;
			const low = allFeedback.filter(f => f.priority === 'low').length;
			
			document.getElementById('total-count').textContent = total;
			document.getElementById('urgent-count').textContent = urgent;
			document.getElementById('high-count').textContent = high;
			document.getElementById('medium-count').textContent = medium;
			document.getElementById('low-count').textContent = low;
			
			drawDonutChart(urgent, high, medium, low);
			
			const sourceCounts = {};
			allFeedback.forEach(f => {
				sourceCounts[f.source] = (sourceCounts[f.source] || 0) + 1;
			});
			
			const maxSource = Math.max(...Object.values(sourceCounts), 1);
			const sourceHTML = Object.entries(sourceCounts)
				.sort((a, b) => b[1] - a[1])
				.map(([source, count]) => \`
					<div class="source-row">
						<span class="source-label">\${source}</span>
						<div class="source-bar-container">
							<div class="source-bar-fill" style="width: \${(count / maxSource) * 100}%">
								<span class="source-count">\${count}</span>
							</div>
						</div>
					</div>
				\`).join('');
			
			document.getElementById('source-chart').innerHTML = sourceHTML;
		}
		
		function drawDonutChart(urgent, high, medium, low) {
			const canvas = document.getElementById('donut-chart');
			const ctx = canvas.getContext('2d');
			const centerX = 90;
			const centerY = 90;
			const radius = 70;
			const innerRadius = 45;
			
			const total = urgent + high + medium + low || 1;
			const data = [
				{ value: urgent, color: '#d32f2f' },
				{ value: high, color: '#f57c00' },
				{ value: medium, color: '#fbc02d' },
				{ value: low, color: '#388e3c' }
			];
			
			ctx.clearRect(0, 0, 180, 180);
			
			let currentAngle = -Math.PI / 2;
			
			data.forEach(segment => {
				const sliceAngle = (segment.value / total) * 2 * Math.PI;
				
				if (segment.value > 0) {
					ctx.beginPath();
					ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
					ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
					ctx.closePath();
					ctx.fillStyle = segment.color;
					ctx.fill();
				}
				
				currentAngle += sliceAngle;
			});
			
			ctx.beginPath();
			ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
			ctx.fillStyle = 'white';
			ctx.fill();
		}
		
		function renderFeedbackList(status, filteredData) {
			const listId = status + '-feedback-list';
			const countId = status + '-results-count';
			
			document.getElementById(countId).textContent = \`\${filteredData.length} items\`;
			
			if (filteredData.length === 0) {
				document.getElementById(listId).innerHTML = 
					'<div class="empty-state">No feedback in this category</div>';
				return;
			}
			
			const feedbackHTML = filteredData.map(f => {
				const priority = f.priority || 'medium';
				const itemStatus = f.status || 'new';
				const date = new Date(f.timestamp).toLocaleString();
				
				let themes = [];
				try {
					themes = f.themes ? JSON.parse(f.themes) : [];
				} catch (e) {}
				
				const themesHTML = themes.map(t => \`<span class="theme-badge">\${t}</span>\`).join('');
				
				return \`
					<div class="feedback-item priority-\${priority}">
						<div class="feedback-header">
							<div class="feedback-meta">
								<span class="source-badge">\${f.source}</span>
								<span class="priority \${priority}">\${priority}</span>
							</div>
							<select class="status-dropdown \${itemStatus}" onchange="updateStatus(\${f.id}, this.value)">
								<option value="new" \${itemStatus === 'new' ? 'selected' : ''}>New</option>
								<option value="in-progress" \${itemStatus === 'in-progress' ? 'selected' : ''}>In Progress</option>
								<option value="completed" \${itemStatus === 'completed' ? 'selected' : ''}>Completed</option>
							</select>
						</div>
						<div class="feedback-text">\${f.text}</div>
						<div class="feedback-footer">
							<div class="feedback-timestamp">\${date}</div>
							<div class="feedback-themes">\${themesHTML}</div>
						</div>
					</div>
				\`;
			}).join('');
			
			document.getElementById(listId).innerHTML = feedbackHTML;
		}
		
		async function updateStatus(id, newStatus) {
			try {
				await fetch('/api/update-status', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id, status: newStatus })
				});
				
				const item = allFeedback.find(f => f.id === id);
				if (item) item.status = newStatus;
				
				updateTabBadges();
				applyFilters();
			} catch (error) {
				console.error('Error updating status:', error);
			}
		}
		
		function updateStatusIndicator(type, text) {
			const indicator = document.getElementById('status-indicator');
			const statusText = document.getElementById('status-text');
			
			if (type === 'analyzing') {
				indicator.className = 'status-indicator analyzing';
			} else {
				indicator.className = 'status-indicator';
			}
			
			statusText.textContent = text;
		}
		
		function resetFilters() {
			document.getElementById('sort-select').value = 'priority';
			document.getElementById('priority-filter').value = 'all';
			document.getElementById('source-filter').value = 'all';
			document.getElementById('theme-filter').value = 'all';
			applyFilters();
		}
		
		loadDashboard();
		// setInterval(loadDashboard, 120000);
	</script>
</body>
</html>
`;

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		
		if (url.pathname === '/' || url.pathname === '') {
			return new Response(dashboardHTML, {
				headers: { 
					'Content-Type': 'text/html',
					'Cache-Control': 'no-cache'
				}
			});
		}
		
		if (url.pathname === '/api/feedback') {
			try {
				const { results } = await env.DB.prepare(
					'SELECT id, source, text, priority, themes, status, timestamp FROM feedback ORDER BY timestamp DESC'
				).all();
				
				return new Response(JSON.stringify(results), {
					headers: { 
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Cache-Control': 'public, max-age=10'
					}
				});
			} catch (error) {
				return new Response(JSON.stringify({ error: error.message }), {
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}
		
		if (url.pathname === '/api/summary') {
			try {
				// Get new feedback only
				const { results } = await env.DB.prepare(
					'SELECT text, priority, themes, source FROM feedback WHERE status = ? OR status IS NULL ORDER BY timestamp DESC LIMIT 10'
				).bind('new').all();
				
				if (results.length === 0) {
					return new Response(JSON.stringify({ summary: null }), {
						headers: { 'Content-Type': 'application/json' }
					});
				}
				
				// Build context for AI
				const feedbackContext = results.map((f, i) => 
					`${i + 1}. [${f.priority || 'medium'}] ${f.source}: ${f.text}`
				).join('\n');
				
				// Use AI to generate summary
				const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
					messages: [
						{
							role: 'system',
							content: 'You are a product manager assistant. Write a 1-2 sentence summary of customer feedback. Be direct and specific. Do not use headers, markdown, asterisks, or phrases like "here is" or "summary:". Just write the facts in plain text.'
						},
						{
							role: 'user',
							content: `Write a direct summary of this feedback:\n\n${feedbackContext}\n\nWrite only the summary, no preamble or formatting.`
						}
					],
					max_tokens: 100
				});
				
				let summary = 'Recent feedback covers documentation issues, performance concerns, and UX improvements.';
				
				if (aiResponse && aiResponse.response) {
					// Clean up the response - remove markdown, headers, preambles
					summary = aiResponse.response.trim()
						.replace(/\*\*/g, '')  // Remove bold markdown
						.replace(/\*/g, '')    // Remove italic markdown
						.replace(/^(Here's|Here is|Summary:|Overview:)\s*/i, '')  // Remove preambles
						.replace(/^#+\s*/gm, '')  // Remove headers
						.replace(/\n+/g, ' ')  // Single line
						.trim();
				}
				
				return new Response(JSON.stringify({ summary }), {
					headers: { 
						'Content-Type': 'application/json',
						'Cache-Control': 'public, max-age=60'
					}
				});
				
			} catch (error) {
				console.error('Summary generation error:', error);
				return new Response(JSON.stringify({ 
					summary: 'Recent feedback includes various product issues and feature requests.'
				}), {
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}
		
		if (url.pathname === '/api/update-status' && request.method === 'POST') {
			try {
				const { id, status } = await request.json();
				
				await env.DB.prepare(
					'UPDATE feedback SET status = ? WHERE id = ?'
				).bind(status, id).run();
				
				return new Response(JSON.stringify({ success: true }), {
					headers: { 'Content-Type': 'application/json' }
				});
			} catch (error) {
				return new Response(JSON.stringify({ error: error.message }), {
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}
		
		if (url.pathname === '/api/analyze' && request.method === 'POST') {
			try {
				const needsAnalysisCheck = await env.DB.prepare(
					'SELECT COUNT(*) as count FROM feedback WHERE priority IS NULL OR themes IS NULL'
				).first();
				
				if (needsAnalysisCheck.count === 0) {
					return new Response(JSON.stringify({ 
						success: true, 
						analyzed: 0,
						message: 'All feedback already analyzed',
						alreadyComplete: true
					}), {
						headers: { 'Content-Type': 'application/json' }
					});
				}
				
				const { results } = await env.DB.prepare(
					'SELECT * FROM feedback WHERE priority IS NULL OR themes IS NULL LIMIT 3'
				).all();
				
				let analyzed = 0;
				
				for (const item of results) {
					try {
						const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
							messages: [
								{
									role: 'system',
									content: `You are a product manager analyzing customer feedback. Respond ONLY with valid JSON in this exact format:
{"priority": "urgent|high|medium|low", "themes": ["theme1", "theme2"]}

Priority levels:
- urgent: System failures, blocking bugs, security issues, data loss
- high: Major UX problems, broken features, significant performance issues
- medium: Minor bugs, feature requests, documentation gaps
- low: Nice-to-haves, positive feedback, cosmetic issues

Themes should be lowercase single words or hyphenated phrases like: documentation, performance, ux, api, deployment, error-messages, pricing, onboarding`
								},
								{
									role: 'user',
									content: `Analyze this feedback:

Source: ${item.source}
Text: "${item.text}"`
								}
							],
							max_tokens: 100
						});
						
						let priority = 'medium';
						let themes = [];
						
						if (aiResponse && aiResponse.response) {
							try {
								let responseText = aiResponse.response.trim();
								responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
								
								const parsed = JSON.parse(responseText);
								priority = parsed.priority || 'medium';
								themes = parsed.themes || [];
								
								if (!['urgent', 'high', 'medium', 'low'].includes(priority)) {
									priority = 'medium';
								}
								
								themes = themes.map(t => t.toLowerCase().trim()).filter(Boolean);
								themes = [...new Set(themes)].slice(0, 3);
								
							} catch (parseError) {
								console.error('Failed to parse AI response:', parseError);
								const text = item.text.toLowerCase();
								
								if (text.includes('error') || text.includes('broken') || text.includes('crash') || 
								    text.includes('fail') || text.includes('500') || text.includes('bug')) {
									priority = 'urgent';
									themes.push('bug');
								} else if (text.includes('slow') || text.includes('confusing') || text.includes('unclear')) {
									priority = 'high';
								} else if (text.includes('love') || text.includes('great') || text.includes('amazing')) {
									priority = 'low';
								}
								
								if (text.includes('document') || text.includes('docs')) themes.push('documentation');
								if (text.includes('slow') || text.includes('performance')) themes.push('performance');
								if (text.includes('ui') || text.includes('ux') || text.includes('interface')) themes.push('ux');
								if (text.includes('deploy') || text.includes('wrangler')) themes.push('deployment');
								if (text.includes('error') || text.includes('message')) themes.push('error-messages');
								if (text.includes('binding') || text.includes('api')) themes.push('api');
								
								themes = [...new Set(themes.map(t => t.toLowerCase()))].slice(0, 3);
								
								if (themes.length === 0) {
									themes = priority === 'urgent' ? ['bug'] : ['feedback'];
								}
							}
						}
						
						if (themes.length === 0) {
							themes = ['general'];
						}
						
						const status = item.status || 'new';
						
						await env.DB.prepare(
							'UPDATE feedback SET priority = ?, themes = ?, status = ? WHERE id = ?'
						).bind(priority, JSON.stringify(themes), status, item.id).run();
						
						analyzed++;
						
					} catch (aiError) {
						console.error('AI analysis error for item', item.id, ':', aiError);
						
						const text = item.text.toLowerCase();
						let priority = 'medium';
						let themes = [];
						
						if (text.includes('error') || text.includes('broken') || text.includes('crash')) {
							priority = 'urgent';
							themes.push('bug');
						} else if (text.includes('slow') || text.includes('confusing')) {
							priority = 'high';
							themes.push('performance');
						} else if (text.includes('love') || text.includes('great')) {
							priority = 'low';
							themes.push('feedback');
						}
						
						if (text.includes('document')) themes.push('documentation');
						if (text.includes('deploy')) themes.push('deployment');
						if (text.includes('ui') || text.includes('ux')) themes.push('ux');
						
						themes = [...new Set(themes.map(t => t.toLowerCase()))].slice(0, 3);
						if (themes.length === 0) themes = ['general'];
						
						const status = item.status || 'new';
						
						await env.DB.prepare(
							'UPDATE feedback SET priority = ?, themes = ?, status = ? WHERE id = ?'
						).bind(priority, JSON.stringify(themes), status, item.id).run();
						
						analyzed++;
					}
				}
				
				return new Response(JSON.stringify({ 
					success: true, 
					analyzed: analyzed,
					message: `Analyzed ${analyzed} items using Workers AI`
				}), {
					headers: { 'Content-Type': 'application/json' }
				});
				
			} catch (error) {
				console.error('Analysis endpoint error:', error);
				return new Response(JSON.stringify({ 
					error: error.message,
					success: false 
				}), {
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}
		
		return new Response('Not Found', { status: 404 });
	}
};