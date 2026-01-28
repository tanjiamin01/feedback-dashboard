/**
 * Feedback Intelligence Dashboard - Optimized Edition
 * Smart priority scoring and theme extraction with optimized database reads
 */

const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Feedback Intelligence Dashboard</title>
	<style>
		* { margin: 0; padding: 0; box-sizing: border-box; }
		body { 
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
			background: #f5f5f5;
			padding: 20px;
		}
		.container { max-width: 1400px; margin: 0 auto; }
		h1 { margin-bottom: 10px; color: #333; }
		.subtitle { color: #666; margin-bottom: 30px; font-size: 14px; }
		
		.insights-section {
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
			padding: 30px;
			border-radius: 8px;
			box-shadow: 0 4px 6px rgba(0,0,0,0.1);
			margin-bottom: 30px;
		}
		
		.insights-section h2 {
			font-size: 24px;
			margin-bottom: 20px;
			display: flex;
			align-items: center;
			gap: 10px;
		}
		
		.insight-item {
			background: rgba(255,255,255,0.1);
			backdrop-filter: blur(10px);
			padding: 15px 20px;
			border-radius: 6px;
			margin-bottom: 12px;
			border-left: 4px solid #ffd700;
		}
		
		.insight-item:last-child { margin-bottom: 0; }
		
		.insight-title {
			font-weight: 600;
			margin-bottom: 5px;
			font-size: 16px;
		}
		
		.insight-description {
			font-size: 14px;
			opacity: 0.9;
			line-height: 1.5;
		}
		
		.stats-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 20px;
			margin-bottom: 30px;
		}
		
		.stat-card {
			background: white;
			padding: 25px;
			border-radius: 8px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		}
		
		.stat-value {
			font-size: 36px;
			font-weight: bold;
			color: #333;
			margin-bottom: 8px;
		}
		
		.stat-label {
			font-size: 14px;
			color: #666;
			text-transform: uppercase;
			letter-spacing: 0.5px;
		}
		
		.stat-trend {
			font-size: 12px;
			color: #999;
			margin-top: 5px;
		}
		
		.controls {
			background: white;
			padding: 20px;
			border-radius: 8px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
			margin-bottom: 30px;
		}
		
		.controls-row {
			display: flex;
			gap: 15px;
			flex-wrap: wrap;
			align-items: center;
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
			padding: 8px 12px;
			background: #e8f5e9;
			border-radius: 4px;
			font-size: 13px;
			color: #2e7d32;
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
			padding: 25px;
			border-radius: 8px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		}
		
		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20px;
		}
		
		.section-header h2 {
			color: #333;
			font-size: 20px;
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
		
		.category-badge {
			display: inline-block;
			padding: 4px 10px;
			background: #f3e5f5;
			color: #7b1fa2;
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
		.priority.analyzing { background: #e2e3e5; color: #383d41; }
		
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
		<h1>🎯 Feedback Intelligence Dashboard</h1>
		<div class="subtitle">AI-powered priority scoring and theme extraction for product managers</div>
		
		<div class="insights-section" id="insights-section">
			<h2>🤖 AI Insights</h2>
			<div id="insights-content">
				<div class="insight-item">
					<div class="insight-description">Analyzing feedback patterns...</div>
				</div>
			</div>
		</div>
		
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-value" id="total-count">-</div>
				<div class="stat-label">Total Feedback</div>
			</div>
			<div class="stat-card">
				<div class="stat-value" id="urgent-count">-</div>
				<div class="stat-label">Urgent Issues</div>
			</div>
			<div class="stat-card">
				<div class="stat-value" id="high-count">-</div>
				<div class="stat-label">High Priority</div>
			</div>
			<div class="stat-card">
				<div class="stat-value" id="themes-count">-</div>
				<div class="stat-label">Themes Detected</div>
			</div>
		</div>
		
		<div class="controls">
			<div class="controls-row">
				<div class="control-group">
					<label>Sort By</label>
					<select id="sort-select" onchange="applyFilters()">
						<option value="priority">Priority (Urgent First)</option>
						<option value="newest">Newest First</option>
						<option value="oldest">Oldest First</option>
					</select>
				</div>
				
				<div class="control-group">
					<label>Filter by Priority</label>
					<select id="priority-filter" onchange="applyFilters()">
						<option value="all">All Priorities</option>
						<option value="urgent">Urgent Only</option>
						<option value="high">High Priority</option>
						<option value="medium">Medium Priority</option>
						<option value="low">Low Priority</option>
					</select>
				</div>
				
				<div class="control-group">
					<label>Filter by Source</label>
					<select id="source-filter" onchange="applyFilters()">
						<option value="all">All Sources</option>
					</select>
				</div>
				
				<div class="control-group">
					<label>Filter by Category</label>
					<select id="category-filter" onchange="applyFilters()">
						<option value="all">All Categories</option>
					</select>
				</div>
				
				<div class="control-group">
					<label>&nbsp;</label>
					<button onclick="resetFilters()">Reset Filters</button>
				</div>
				
				<div class="status-indicator" id="status-indicator">
					<div class="pulse"></div>
					<span id="status-text">Live</span>
				</div>
			</div>
		</div>
		
		<div class="feedback-section">
			<div class="section-header">
				<h2>💬 Prioritized Feedback</h2>
				<span class="results-count" id="results-count">Showing 0 of 0</span>
			</div>
			<div id="feedback-list"></div>
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
		let filteredFeedback = [];
		let insights = [];
		
		async function loadDashboard() {
			try {
				const response = await fetch('/api/feedback');
				const data = await response.json();
				allFeedback = data;
				
				// Check if any items need analysis (client-side check to avoid extra API call)
				const needsAnalysis = data.some(f => !f.priority || !f.themes);
				
				if (needsAnalysis) {
					showLoading(true, 'Analyzing feedback...');
					updateStatus('analyzing', 'Analyzing feedback...');
					
					// Run analysis once
					const analysisResponse = await fetch('/api/analyze', { method: 'POST' });
					const analysisResult = await analysisResponse.json();
					
					console.log('Analysis result:', analysisResult);
					
					// Only reload if something was actually analyzed
					if (analysisResult.analyzed > 0) {
						const refreshed = await fetch('/api/feedback');
						allFeedback = await refreshed.json();
					}
					
					showLoading(false);
					updateStatus('live', 'Live');
				} else {
					updateStatus('live', 'Live');
				}
				
				// Get insights (single request)
				const insightsResponse = await fetch('/api/insights');
				insights = await insightsResponse.json();
				
				renderInsights(insights);
				populateFilters(allFeedback);
				applyFilters();
				
			} catch (error) {
				console.error('Error loading dashboard:', error);
				updateStatus('error', 'Error loading data');
				showLoading(false);
			}
		}
		
		function showLoading(show, text = '') {
			const overlay = document.getElementById('loading-overlay');
			const loadingText = document.getElementById('loading-text');
			overlay.style.display = show ? 'flex' : 'none';
			if (text) loadingText.textContent = text;
		}
		
		function renderInsights(insights) {
			if (!insights || !insights.themes || insights.themes.length === 0) {
				document.getElementById('insights-content').innerHTML = \`
					<div class="insight-item">
						<div class="insight-description">No insights available yet. Add more feedback to see patterns.</div>
					</div>
				\`;
				return;
			}
			
			let html = '';
			
			// Top themes
			if (insights.themes && insights.themes.length > 0) {
				html += \`
					<div class="insight-item">
						<div class="insight-title">🎯 Top Themes Across All Feedback</div>
						<div class="insight-description">\${insights.themes.slice(0, 5).join(' • ')}</div>
					</div>
				\`;
			}
			
			// Urgent items
			if (insights.urgentCount > 0) {
				html += \`
					<div class="insight-item">
						<div class="insight-title">⚠️ Action Required</div>
						<div class="insight-description">\${insights.urgentCount} urgent issues need immediate attention. Focus on: \${insights.urgentCategories || 'error handling and performance'}</div>
					</div>
				\`;
			}
			
			// Common pain points
			if (insights.commonPainPoints) {
				html += \`
					<div class="insight-item">
						<div class="insight-title">📉 Common Pain Points</div>
						<div class="insight-description">\${insights.commonPainPoints}</div>
					</div>
				\`;
			}
			
			// Recommendation
			if (insights.recommendation) {
				html += \`
					<div class="insight-item">
						<div class="insight-title">💡 Recommended Next Steps</div>
						<div class="insight-description">\${insights.recommendation}</div>
					</div>
				\`;
			}
			
			document.getElementById('insights-content').innerHTML = html;
		}
		
		function populateFilters(data) {
			const sources = [...new Set(data.map(f => f.source))].sort();
			const sourceFilter = document.getElementById('source-filter');
			sourceFilter.innerHTML = '<option value="all">All Sources</option>' +
				sources.map(s => \`<option value="\${s}">\${s}</option>\`).join('');
			
			const categories = [...new Set(data.map(f => f.category))].sort();
			const categoryFilter = document.getElementById('category-filter');
			categoryFilter.innerHTML = '<option value="all">All Categories</option>' +
				categories.map(c => \`<option value="\${c}">\${c}</option>\`).join('');
		}
		
		function applyFilters() {
			const sortBy = document.getElementById('sort-select').value;
			const priorityFilter = document.getElementById('priority-filter').value;
			const sourceFilter = document.getElementById('source-filter').value;
			const categoryFilter = document.getElementById('category-filter').value;
			
			filteredFeedback = allFeedback.filter(item => {
				if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
				if (sourceFilter !== 'all' && item.source !== sourceFilter) return false;
				if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
				return true;
			});
			
			filteredFeedback.sort((a, b) => {
				switch(sortBy) {
					case 'priority':
						const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3, analyzing: 4 };
						return priorityOrder[a.priority || 'analyzing'] - priorityOrder[b.priority || 'analyzing'];
					case 'newest':
						return new Date(b.timestamp) - new Date(a.timestamp);
					case 'oldest':
						return new Date(a.timestamp) - new Date(b.timestamp);
					default:
						return 0;
				}
			});
			
			renderDashboard();
		}
		
		function renderDashboard() {
			const total = allFeedback.length;
			const urgent = allFeedback.filter(f => f.priority === 'urgent').length;
			const high = allFeedback.filter(f => f.priority === 'high').length;
			
			// Extract unique themes
			const allThemes = new Set();
			allFeedback.forEach(f => {
				if (f.themes) {
					try {
						const themes = JSON.parse(f.themes);
						themes.forEach(t => allThemes.add(t));
					} catch (e) {}
				}
			});
			
			document.getElementById('total-count').textContent = total;
			document.getElementById('urgent-count').textContent = urgent;
			document.getElementById('high-count').textContent = high;
			document.getElementById('themes-count').textContent = allThemes.size;
			
			document.getElementById('results-count').textContent = 
				\`Showing \${filteredFeedback.length} of \${total}\`;
			
			if (filteredFeedback.length === 0) {
				document.getElementById('feedback-list').innerHTML = 
					'<div class="empty-state">No feedback matches your filters</div>';
				return;
			}
			
			const feedbackHTML = filteredFeedback.map(f => {
				const priority = f.priority || 'analyzing';
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
								<span class="category-badge">\${f.category}</span>
							</div>
							<span class="priority \${priority}">\${priority}</span>
						</div>
						<div class="feedback-text">\${f.text}</div>
						<div class="feedback-footer">
							<div class="feedback-timestamp">\${date}</div>
							<div class="feedback-themes">\${themesHTML}</div>
						</div>
					</div>
				\`;
			}).join('');
			
			document.getElementById('feedback-list').innerHTML = feedbackHTML;
		}
		
		function updateStatus(type, text) {
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
			document.getElementById('category-filter').value = 'all';
			applyFilters();
		}
		
		loadDashboard();
		// Auto-refresh every 2 minutes (less frequent to reduce DB load)
		setInterval(loadDashboard, 120000);
	</script>
</body>
</html>
`;

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		
		// Serve the dashboard HTML
		if (url.pathname === '/' || url.pathname === '') {
			return new Response(dashboardHTML, {
				headers: { 
					'Content-Type': 'text/html',
					'Cache-Control': 'no-cache'
				}
			});
		}
		
		// Get all feedback (optimized single query with caching)
		if (url.pathname === '/api/feedback') {
			try {
				const { results } = await env.DB.prepare(
					'SELECT * FROM feedback ORDER BY timestamp DESC'
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
		
		// Get AI-powered insights
		if (url.pathname === '/api/insights') {
			try {
				const { results } = await env.DB.prepare(
					'SELECT priority, themes, category FROM feedback'
				).all();
				
				// Extract all themes
				const allThemes = [];
				results.forEach(f => {
					if (f.themes) {
						try {
							const themes = JSON.parse(f.themes);
							allThemes.push(...themes);
						} catch (e) {}
					}
				});
				
				// Count theme frequency
				const themeCounts = {};
				allThemes.forEach(theme => {
					themeCounts[theme] = (themeCounts[theme] || 0) + 1;
				});
				
				// Get top themes
				const topThemes = Object.entries(themeCounts)
					.sort((a, b) => b[1] - a[1])
					.slice(0, 5)
					.map(([theme]) => theme);
				
				// Count urgent items
				const urgentCount = results.filter(f => f.priority === 'urgent').length;
				const highCount = results.filter(f => f.priority === 'high').length;
				
				// Get urgent categories
				const urgentItems = results.filter(f => f.priority === 'urgent');
				const urgentCategories = [...new Set(urgentItems.map(f => f.category))].join(', ');
				
				// Generate insights
				const insights = {
					themes: topThemes,
					urgentCount,
					highCount,
					urgentCategories,
					commonPainPoints: topThemes.length > 0 
						? `Users are reporting issues with: ${topThemes.slice(0, 3).join(', ')}`
						: 'Not enough data to identify pain points',
					recommendation: urgentCount > 0
						? `Prioritize fixing ${urgentCount} urgent issues, especially in ${urgentCategories}`
						: highCount > 0
						? `Focus on ${highCount} high-priority items to improve user experience`
						: 'Continue monitoring feedback for emerging patterns'
				};
				
				return new Response(JSON.stringify(insights), {
					headers: { 
						'Content-Type': 'application/json',
						'Cache-Control': 'public, max-age=30'
					}
				});
				
			} catch (error) {
				return new Response(JSON.stringify({ error: error.message }), {
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}
		
		// Smart analysis - only runs if needed (optimized with caching check)
		if (url.pathname === '/api/analyze' && request.method === 'POST') {
			try {
				// Check if analysis is needed (optimized COUNT query)
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
				
				// Analyze only unanalyzed items (limit 5 for cost control)
				const { results } = await env.DB.prepare(
					'SELECT * FROM feedback WHERE priority IS NULL OR themes IS NULL LIMIT 5'
				).all();
				
				let analyzed = 0;
				
				for (const item of results) {
					const text = item.text.toLowerCase();
					let priority = 'medium';
					let themes = [item.category.toLowerCase()];
					
					// Rule-based priority assignment
					if (text.includes('error') || text.includes('broken') || text.includes('crash') || 
					    text.includes('fail') || text.includes('500') || text.includes('bug')) {
						priority = 'urgent';
					} else if (text.includes('slow') || text.includes('confusing') || text.includes('unclear') || 
					           text.includes('missing') || text.includes('difficult') || text.includes('cant')) {
						priority = 'high';
					} else if (text.includes('love') || text.includes('great') || text.includes('amazing') || 
					           text.includes('smooth') || text.includes('easy')) {
						priority = 'low';
					}
					
					// Theme extraction
					if (text.includes('document') || text.includes('docs') || text.includes('example')) {
						themes.push('documentation');
					}
					if (text.includes('slow') || text.includes('performance') || text.includes('speed') || text.includes('takes forever')) {
						themes.push('performance');
					}
					if (text.includes('ui') || text.includes('ux') || text.includes('interface') || text.includes('dashboard') || text.includes('confusing')) {
						themes.push('UX');
					}
					if (text.includes('deploy') || text.includes('build') || text.includes('wrangler')) {
						themes.push('deployment');
					}
					if (text.includes('error') || text.includes('message') || text.includes('cryptic')) {
						themes.push('error-messages');
					}
					if (text.includes('binding') || text.includes('d1') || text.includes('api')) {
						themes.push('API');
					}
					if (text.includes('pricing') || text.includes('cost') || text.includes('request')) {
						themes.push('pricing');
					}
					
					// Deduplicate themes, limit to 3
					themes = [...new Set(themes)].slice(0, 3);
					
					// Single update per item
					await env.DB.prepare(
						'UPDATE feedback SET priority = ?, themes = ? WHERE id = ?'
					).bind(priority, JSON.stringify(themes), item.id).run();
					
					analyzed++;
				}
				
				return new Response(JSON.stringify({ 
					success: true, 
					analyzed: analyzed,
					message: `Analyzed ${analyzed} items`,
					moreToAnalyze: results.length === 5
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
		
		// 404 for unknown routes
		return new Response('Not Found', { status: 404 });
	}
};