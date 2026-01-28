/**
 * Feedback Analysis Dashboard - PM Edition
 * Auto-analyzes sentiment and provides filtering/sorting for PMs
 */

const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Feedback Analysis Dashboard</title>
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
		
		.sentiment {
			display: inline-block;
			padding: 6px 14px;
			border-radius: 4px;
			font-size: 13px;
			font-weight: bold;
			text-transform: capitalize;
		}
		
		.sentiment.positive { background: #d4edda; color: #155724; }
		.sentiment.neutral { background: #fff3cd; color: #856404; }
		.sentiment.negative { background: #f8d7da; color: #721c24; }
		.sentiment.analyzing { background: #e2e3e5; color: #383d41; }
		
		.feedback-text {
			color: #333;
			line-height: 1.6;
			margin-bottom: 10px;
		}
		
		.feedback-timestamp {
			font-size: 12px;
			color: #999;
		}
		
		.empty-state {
			text-align: center;
			padding: 60px 20px;
			color: #999;
		}
		
		.category-breakdown {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			gap: 15px;
			margin-bottom: 30px;
		}
		
		.category-item {
			background: white;
			padding: 15px;
			border-radius: 6px;
			border-left: 4px solid #0051c3;
			cursor: pointer;
			transition: transform 0.2s;
		}
		
		.category-item:hover {
			transform: translateX(5px);
		}
		
		.category-name {
			font-size: 14px;
			color: #666;
			margin-bottom: 5px;
		}
		
		.category-count {
			font-size: 24px;
			font-weight: bold;
			color: #333;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>📊 Feedback Analysis Dashboard</h1>
		<div class="subtitle">Real-time customer feedback aggregation with AI-powered sentiment analysis</div>
		
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-value" id="total-count">-</div>
				<div class="stat-label">Total Feedback</div>
				<div class="stat-trend" id="total-trend"></div>
			</div>
			<div class="stat-card">
				<div class="stat-value" id="positive-count">-</div>
				<div class="stat-label">Positive</div>
				<div class="stat-trend" id="positive-percent"></div>
			</div>
			<div class="stat-card">
				<div class="stat-value" id="neutral-count">-</div>
				<div class="stat-label">Neutral</div>
				<div class="stat-trend" id="neutral-percent"></div>
			</div>
			<div class="stat-card">
				<div class="stat-value" id="negative-count">-</div>
				<div class="stat-label">Negative</div>
				<div class="stat-trend" id="negative-percent"></div>
			</div>
		</div>
		
		<div class="controls">
			<div class="controls-row">
				<div class="control-group">
					<label>Sort By</label>
					<select id="sort-select" onchange="applyFilters()">
						<option value="newest">Newest First</option>
						<option value="oldest">Oldest First</option>
						<option value="most-negative">Most Negative</option>
						<option value="most-positive">Most Positive</option>
					</select>
				</div>
				
				<div class="control-group">
					<label>Filter by Sentiment</label>
					<select id="sentiment-filter" onchange="applyFilters()">
						<option value="all">All Sentiments</option>
						<option value="positive">Positive Only</option>
						<option value="neutral">Neutral Only</option>
						<option value="negative">Negative Only</option>
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
				<h2>💬 Feedback Items</h2>
				<span class="results-count" id="results-count">Showing 0 of 0</span>
			</div>
			<div id="feedback-list"></div>
		</div>
	</div>
	
	<script>
		let allFeedback = [];
		let filteredFeedback = [];
		
		async function loadDashboard() {
			try {
				const response = await fetch('/api/feedback');
				const data = await response.json();
				allFeedback = data;
				
				// Check if any items need analysis
				const needsAnalysis = data.filter(f => !f.sentiment || f.sentiment === 'analyzing');
				if (needsAnalysis.length > 0) {
					updateStatus('analyzing', \`Analyzing \${needsAnalysis.length} items...\`);
					await analyzeFeedback();
					// Reload after analysis
					const refreshed = await fetch('/api/feedback');
					allFeedback = await refreshed.json();
				} else {
					updateStatus('live', 'Live');
				}
				
				// Populate filter dropdowns
				populateFilters(allFeedback);
				
				// Apply filters and render
				applyFilters();
				
			} catch (error) {
				console.error('Error loading dashboard:', error);
				updateStatus('error', 'Error loading data');
			}
		}
		
		function populateFilters(data) {
			// Get unique sources
			const sources = [...new Set(data.map(f => f.source))].sort();
			const sourceFilter = document.getElementById('source-filter');
			sourceFilter.innerHTML = '<option value="all">All Sources</option>' +
				sources.map(s => \`<option value="\${s}">\${s}</option>\`).join('');
			
			// Get unique categories
			const categories = [...new Set(data.map(f => f.category))].sort();
			const categoryFilter = document.getElementById('category-filter');
			categoryFilter.innerHTML = '<option value="all">All Categories</option>' +
				categories.map(c => \`<option value="\${c}">\${c}</option>\`).join('');
		}
		
		function applyFilters() {
			const sortBy = document.getElementById('sort-select').value;
			const sentimentFilter = document.getElementById('sentiment-filter').value;
			const sourceFilter = document.getElementById('source-filter').value;
			const categoryFilter = document.getElementById('category-filter').value;
			
			// Filter
			filteredFeedback = allFeedback.filter(item => {
				if (sentimentFilter !== 'all' && item.sentiment !== sentimentFilter) return false;
				if (sourceFilter !== 'all' && item.source !== sourceFilter) return false;
				if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
				return true;
			});
			
			// Sort
			filteredFeedback.sort((a, b) => {
				switch(sortBy) {
					case 'newest':
						return new Date(b.timestamp) - new Date(a.timestamp);
					case 'oldest':
						return new Date(a.timestamp) - new Date(b.timestamp);
					case 'most-negative':
						const sentimentOrder = { negative: 0, neutral: 1, positive: 2, analyzing: 3 };
						return sentimentOrder[a.sentiment || 'analyzing'] - sentimentOrder[b.sentiment || 'analyzing'];
					case 'most-positive':
						const sentimentOrder2 = { positive: 0, neutral: 1, negative: 2, analyzing: 3 };
						return sentimentOrder2[a.sentiment || 'analyzing'] - sentimentOrder2[b.sentiment || 'analyzing'];
					default:
						return 0;
				}
			});
			
			renderDashboard();
		}
		
		function renderDashboard() {
			// Update stats
			const total = allFeedback.length;
			const positive = allFeedback.filter(f => f.sentiment === 'positive').length;
			const neutral = allFeedback.filter(f => f.sentiment === 'neutral').length;
			const negative = allFeedback.filter(f => f.sentiment === 'negative').length;
			
			document.getElementById('total-count').textContent = total;
			document.getElementById('positive-count').textContent = positive;
			document.getElementById('neutral-count').textContent = neutral;
			document.getElementById('negative-count').textContent = negative;
			
			const analyzed = positive + neutral + negative;
			if (analyzed > 0) {
				document.getElementById('positive-percent').textContent = \`\${Math.round(positive/analyzed*100)}% of analyzed\`;
				document.getElementById('neutral-percent').textContent = \`\${Math.round(neutral/analyzed*100)}% of analyzed\`;
				document.getElementById('negative-percent').textContent = \`\${Math.round(negative/analyzed*100)}% of analyzed\`;
			}
			
			// Update results count
			document.getElementById('results-count').textContent = 
				\`Showing \${filteredFeedback.length} of \${total}\`;
			
			// Render feedback list
			if (filteredFeedback.length === 0) {
				document.getElementById('feedback-list').innerHTML = 
					'<div class="empty-state">No feedback matches your filters</div>';
				return;
			}
			
			const feedbackHTML = filteredFeedback.map(f => {
				const sentiment = f.sentiment || 'analyzing';
				const date = new Date(f.timestamp).toLocaleString();
				
				return \`
					<div class="feedback-item">
						<div class="feedback-header">
							<div class="feedback-meta">
								<span class="source-badge">\${f.source}</span>
								<span class="category-badge">\${f.category}</span>
							</div>
							<span class="sentiment \${sentiment}">\${sentiment}</span>
						</div>
						<div class="feedback-text">\${f.text}</div>
						<div class="feedback-timestamp">\${date}</div>
					</div>
				\`;
			}).join('');
			
			document.getElementById('feedback-list').innerHTML = feedbackHTML;
		}
		
		async function analyzeFeedback() {
			try {
				await fetch('/api/analyze', { method: 'POST' });
			} catch (error) {
				console.error('Error analyzing feedback:', error);
			}
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
			document.getElementById('sort-select').value = 'newest';
			document.getElementById('sentiment-filter').value = 'all';
			document.getElementById('source-filter').value = 'all';
			document.getElementById('category-filter').value = 'all';
			applyFilters();
		}
		
		// Load dashboard on page load
		loadDashboard();
		
		// Auto-refresh every 30 seconds
		setInterval(loadDashboard, 30000);
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
		
		// API: Get all feedback
		if (url.pathname === '/api/feedback') {
			try {
				const { results } = await env.DB.prepare(
					'SELECT * FROM feedback ORDER BY timestamp DESC'
				).all();
				
				return new Response(JSON.stringify(results), {
					headers: { 
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}
				});
			} catch (error) {
				return new Response(JSON.stringify({ error: error.message }), {
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}
		
		// API: Run sentiment analysis with Workers AI (auto-triggered)
		if (url.pathname === '/api/analyze' && request.method === 'POST') {
			try {
				// Get feedback items that haven't been analyzed yet
				const { results } = await env.DB.prepare(
					'SELECT * FROM feedback WHERE sentiment IS NULL LIMIT 10'
				).all();
				
				let analyzed = 0;
				
				// Analyze each item with Workers AI
				for (const item of results) {
					try {
						const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
							messages: [
								{
									role: 'system',
									content: 'You are a sentiment analyzer. Respond with only ONE word: positive, neutral, or negative.'
								},
								{
									role: 'user',
									content: `Analyze the sentiment of this customer feedback: "\${item.text}"`
								}
							]
						});
						
						// Extract sentiment from AI response
						let sentiment = 'neutral';
						if (aiResponse && aiResponse.response) {
							const response = aiResponse.response.toLowerCase().trim();
							if (response.includes('positive')) sentiment = 'positive';
							else if (response.includes('negative')) sentiment = 'negative';
							else if (response.includes('neutral')) sentiment = 'neutral';
						}
						
						// Update the database
						await env.DB.prepare(
							'UPDATE feedback SET sentiment = ? WHERE id = ?'
						).bind(sentiment, item.id).run();
						
						analyzed++;
						
					} catch (aiError) {
						console.error('AI analysis error for item', item.id, aiError);
						// Mark as neutral if AI fails
						await env.DB.prepare(
							'UPDATE feedback SET sentiment = ? WHERE id = ?'
						).bind('neutral', item.id).run();
					}
				}
				
				return new Response(JSON.stringify({ 
					success: true, 
					analyzed: analyzed,
					message: `Analyzed ${analyzed} feedback items`
				}), {
					headers: { 'Content-Type': 'application/json' }
				});
				
			} catch (error) {
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