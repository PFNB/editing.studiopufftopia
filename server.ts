import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get('/api/metadata', async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'No URL provided' });
    }

    try {
      // Use a custom User-Agent to avoid getting blocked as a bot by some services
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await response.text();
      
      let title = '';
      let thumbnail = '';
      let duration = '';

      // Special handling for YouTube using noembed
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        try {
          const noembedRes = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
          if (noembedRes.ok) {
            const noembedData = await noembedRes.json();
            if (noembedData.title) title = noembedData.title;
          }
        } catch (e) {
          console.error("noembed fetch error", e);
        }
        
        // Get max resolution thumbnail
        const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        if (videoIdMatch && videoIdMatch[1]) {
          thumbnail = `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
          
          // Try to get duration and title from raw HTML using Googlebot user agent to bypass bot protection
          try {
             const ytRes = await fetch(`https://www.youtube.com/watch?v=${videoIdMatch[1]}`, {
               headers: {
                 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
               }
             });
             
             if (ytRes.ok) {
                const html = await ytRes.text();
                const durationMatch = html.match(/"lengthSeconds":"(\d+)"/);
                if (durationMatch) {
                   const seconds = parseInt(durationMatch[1], 10);
                   const m = Math.floor(seconds / 60);
                   const s = seconds % 60;
                   duration = `${m}:${s.toString().padStart(2, '0')}`;
                }
                
                if (!title) {
                  const titleMatch = html.match(/"title":{"simpleText":"([^"]+)"}/) || html.match(/<title>([^<]+)<\/title>/);
                  if (titleMatch) {
                    title = titleMatch[1].replace(' - YouTube', '').replace('&#39;', "'").replace('&amp;', '&');
                  }
                }
             }
          } catch (e) {
            console.error("Failed to fetch YT duration", e);
          }
        }
      } else {
        // Fallback for non-youtube URLs
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });
          const html = await response.text();
          
          const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i);
          if (ogTitleMatch) {
            title = ogTitleMatch[1];
          } else {
            const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
            if (titleMatch) title = titleMatch[1];
          }
          
          const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
          if (ogImageMatch) {
            thumbnail = ogImageMatch[1];
          }

          if (url.includes('instagram.com') && title === 'Instagram') {
            const contentMatch = html.match(/<meta property="og:description" content="([^"]+)"/i);
            if (contentMatch) {
               title = contentMatch[1].split(' - ')[0].substring(0, 50) + '...';
            } else {
               title = '';
            }
          }

          title = title.replace(/&amp;/g, '&')
                       .replace(/&lt;/g, '<')
                       .replace(/&gt;/g, '>')
                       .replace(/&quot;/g, '"')
                       .replace(/&#39;/g, "'");
        } catch (e) {
           console.error("HTML fetch error", e);
        }
      }

      res.json({ title, thumbnail, duration });
    } catch (error) {
      console.error('Metadata fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch metadata' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
