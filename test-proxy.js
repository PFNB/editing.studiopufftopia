async function run() {
  const res = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.youtube.com/watch?v=OGY_YoLLqHk'));
  const html = await res.text();
  console.log(html.match(/duration/i) ? 'has duration' : 'no duration');
}
run();
