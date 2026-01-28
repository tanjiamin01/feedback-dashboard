/**
 * Feedback Analysis Dashboard
 * Aggregates customer feedback and uses Workers AI for sentiment analysis
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
		.container { max-width: 1200px; margin: 0 auto; }
		h1 { margin-bottom: 30px; color: #333; }
		
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
		
		.controls {
			background: white;
			padding: 20px;
			border-radius: 8px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
			margin-bottom: 30px;
			display: flex;
			gap: 15px;
			align-items: center;
		}
		
		button {
			padding: 12px 24px;
			background: #0051c3;
			color: white;
			border: none;
			border-radius: 4px;
			font-size: 14px;
			font-weight: 600;
			cursor: pointer;
			transition: background 0.2s;
		}
		
		button:hover { background: #003d99; }
		button:disabled { background: #ccc; cursor: not-allowed; }
		
		.loading { color: #666; font-style: italic; }
		
		.feedback-section {
			background: white;
			padding: 25px;
			border-radius: 8px;
			box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		}
		
		.feedback-section h2 {
			margin-bottom: 20px;
			color: #333;
			font-size: 20px;
		}
		
		.feedback-item {
			border: 1px solid #e0e0e0;
			padding: 20px;
			margin-bottom: 15px;
			border-radius: 6px;
			background: #fafafa;
		}
		
		.feedback-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 12px;
		}
		
		.feedback-meta {
			display: flex;
			gap: 12px;
			align-items: center;
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
		.sentiment.unanalyzed { background: #e2e3e5; color: #383d41; }
		
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
		
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-value" id="total-count">-</div>
				<div class="stat-label">Total Feedback</div>
			</div>
			<div class="stat-card">
				<div class="stat-value" id="positive-count">-</div>
				<div class="stat-label">Positive</div>
			</div>
			<div class="stat-card">
				<div class="stat-value" id="neutral-count">-</div>
				<div class="stat-label">Neutral</div>
			</div>
			<div class="stat-card">
				<div class="stat-value" id="negative-count">-</div>
				<div class="stat-label">Negative</div>
			</div>
		</div>
		
		<div class="controls">
			<button id="analyze-btn" onclick="analyzeFeedback()">🤖 Run AI Sentiment Analysis</button>
			<button onclick="loadDashboard()">🔄 Refresh Data</button>
			<span class="loading" id="loading-status"></span>
		</div>
		
		<div class="feedback-section">
			<h2>📈 Category Breakdown</h2>
			<div class="category-breakdown" id="category-breakdown"></div>
		</div>
		
		<div class="feedback-section">
			<h2>💬 Recent Feedback</h2>
			<div id="feedback-list"></div>
		</div>
	</div>
	
	<script>
		async function loadDashboard() {
			try {
				const response = await fetch('/api/feedback');
				const data = await response.json();
				
				// Update stats
				document.getElementById('total-count').textContent = data.length;
				
				const positive = data.filter(f => f.sentiment === 'positive').length;
				const neutral = data.filter(f => f.sentiment === 'neutral').length;
				const negative = data.filter(f => f.sentiment === 'negative').length;
				
				document.getElementById('positive-count').textContent = positive;
				document.getElementById('neutral-count').textContent = neutral;
				document.getElementById('negative-count').textContent = negative;
				
				// Category breakdown
				const categories = {};
				data.forEach(f => {
					categories[f.category] = (categories[f.category] || 0) + 1;
				});
				
				const categoryHTML = Object.entries(categories)
					.sort((a, b) => b[1] - a[1])
					.map(([cat, count]) => \`
						<div class="category-item">
							<div class="category-name">\${cat}</div>
							<div class="category-count">\${count}</div>
						</div>
					\`).join('');
				
				document.getElementById('category-breakdown').innerHTML = categoryHTML;
				
				// Feedback list
				if (data.length === 0) {
					document.getElementById('feedback-list').innerHTML = 
						'<div class="empty-state">No feedback found</div>';
					return;
				}
				
				const feedbackHTML = data.map(f => {
					const sentiment = f.sentiment || 'unanalyzed';
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
				
			} catch (error) {
				console.error('Error loading dashboard:', error);
				alert('Failed to load dashboard data');
			}
		}
		
		async function analyzeFeedback() {
			const btn = document.getElementById('analyze-btn');
			const status = document.getElementById('loading-status');
			
			btn.disabled = true;
			status.textContent = 'Analyzing feedback with AI...';
			
			try {
				const response = await fetch('/api/analyze', { method: 'POST' });
				const result = await response.json();
				
				status.textContent = \`Analyzed \${result.analyzed} items. Refreshing...\`;
				
				setTimeout(() => {
					loadDashboard();
					status.textContent = '';
					btn.disabled = false;
				}, 1000);
				
			} catch (error) {
				console.error('Error analyzing feedback:', error);
				status.textContent = 'Analysis failed';
				btn.disabled = false;
			}
		}
		
		// Load dashboard on page load
		loadDashboard();
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
		
		// API: Run sentiment analysis with Workers AI
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
									content: `Analyze the sentiment of this customer feedback: "${item.text}"`
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
						// Continue with next item even if one fails
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