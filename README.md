<!--
HackerFab — GitHub Pages-ready single-file website
Generated from user's pitch deck (Copy of General HackerFab pitch deck.pdf).

How to use:
1. Save this file as index.html
2. Create a repo (e.g. your-username.github.io) and push index.html
3. Enable GitHub Pages in repo settings if needed.

This site summarizes the pitch: vision, plan, resources, team, and contact.
Source: Copy of General HackerFab pitch deck (uploaded by user). See citation in ChatGPT. 
-->

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>HackerFab — Student Microfabrication Lab</title>
  <meta name="description" content="HackerFab: a student-led open-source microfabrication lab. Built from the pitch deck." />
  <style>
    :root{--bg:#071026;--card:#0b1220;--muted:#9aa6bf;--accent:#67e8f9}
    *{box-sizing:border-box}
    body{margin:0;font-family:Inter,system-ui,Arial;color:#e6eef8;background:linear-gradient(180deg,#071025,#051126);}
    .wrap{max-width:980px;margin:36px auto;padding:20px}
    header{display:flex;align-items:center;justify-content:space-between;gap:16px}
    .logo{width:60px;height:60px;border-radius:10px;background:linear-gradient(135deg,#06b6d4,#60a5fa);display:flex;align-items:center;justify-content:center;font-weight:800;color:#022}
    h1{margin:6px 0;font-size:28px}
    p.lead{margin:6px 0;color:var(--muted)}
    nav a{margin-left:12px;color:var(--accent);text-decoration:none}
    .hero{display:flex;gap:18px;align-items:center;background:rgba(255,255,255,0.02);padding:18px;border-radius:12px;border:1px solid rgba(255,255,255,0.03)}
    section{margin-top:18px}
    .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    .card{background:var(--card);padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.03)}
    footer{margin-top:28px;color:var(--muted);text-align:center}
    pre.pdf{white-space:pre-wrap;color:var(--muted);font-size:14px}
    @media(max-width:860px){.grid{grid-template-columns:1fr}}
    .btn{display:inline-block;padding:10px 14px;border-radius:10px;background:linear-gradient(90deg,#06b6d4,#60a5fa);color:#022;font-weight:700;border:none;text-decoration:none}
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div style="display:flex;gap:12px;align-items:center">
        <div class="logo">HF</div>
        <div>
          <div style="font-weight:700">HackerFab — IITB</div>
          <div class="muted" style="color:var(--muted);font-size:13px">Student‑led open‑source microfabrication lab</div>
        </div>
      </div>
      <nav>
        <a href="#vision">Vision</a>
        <a href="#plan">Plan</a>
        <a href="#resources">Resources</a>
        <a href="#team">Team</a>
        <a class="btn" href="#download">Download PDF</a>
      </nav>
    </header>

    <main>
      <section class="hero" aria-label="hero">
        <div style="flex:1">
          <h1>HackerFab — Build, Learn, Open Source</h1>
          <p class="lead">A student-built microfabrication initiative to provide hands-on semiconductor training, low-cost tools, and an open learning ecosystem. (Sourced from the pitch deck uploaded.)</p>
          <p style="margin-top:10px"><a class="btn" href="#contact">Get involved</a></p>
        </div>
        <div style="width:220px;text-align:center">
          <div style="padding:10px;border-radius:10px;background:rgba(255,255,255,0.02)">
            <strong>Goal</strong>
            <div class="muted" style="margin-top:8px;color:var(--muted)">Build India’s first student-built, student-run nanofabrication facility and grow a grassroots ecosystem that complements the national semiconductor mission.</div>
          </div>
        </div>
      </section>

      <section id="vision">
        <div class="card">
          <h2>Vision</h2>
          <p class="muted">Create an affordable, open-source fabrication toolset and learning environment that produces industry-ready talent and inspires replication across institutes. This summary follows the uploaded pitch deck. fileciteturn0file0</p>
          <div style="margin-top:8px" class="grid">
            <div class="card"><h3>Exposure</h3><p class="muted">Provide hands-on experience with semiconductor technology.</p></div>
            <div class="card"><h3>Access</h3><p class="muted">Lower costs and open access to tools, labs, and interdisciplinary projects.</p></div>
            <div class="card"><h3>Collaboration</h3><p class="muted">Foster teamwork, open learning, and participation in the global HackerFab community.</p></div>
          </div>
        </div>
      </section>

      <section id="what">
        <div class="card">
          <h2>What is HackerFab?</h2>
          <p class="muted">Student-led team building low-cost fabrication equipment from scratch, following open-source principles. Hands-on learning to understand semiconductor physics and process flow. Part of a larger international HackerFab community (CMU, UWaterloo, MIT). fileciteturn0file0</p>
        </div>
      </section>

      <section id="plan">
        <div class="card">
          <h2>Plan of Action</h2>
          <p class="muted">Organized into team planning, workspace setup, and staged tool builds. Examples of ongoing and completed items are below (from the pitch deck). fileciteturn0file0</p>
          <div style="margin-top:10px" class="grid">
            <div class="card"><h3>Lithography</h3><p class="muted">Projector & microscope acquired; UV LEDs; UV PCB design; stands & holders in CAD.</p></div>
            <div class="card"><h3>Spin Coater</h3><p class="muted">Motor and microcontroller acquired; gravity chuck designed and manufactured.</p></div>
            <div class="card"><h3>Future Tools</h3><p class="muted">v2/v3 builds, ALD, sputter, tube furnace, and open-source EDA tools.</p></div>
          </div>
        </div>
      </section>

      <section id="resources">
        <div class="card">
          <h2>Resource Requirements</h2>
          <p class="muted">Materials, workspace, and funding needs—mechanical supplies, electrical components, wafers, photoresist, optics, 3D printers, laser cutters, and bench space. See pitch deck for full breakdown. fileciteturn0file0</p>
          <ul class="muted">
            <li>Mechanical: metal, 3D filament, toolkit</li>
            <li>Electrical: motors, microcontrollers, PCBs</li>
            <li>Fabrication: wafers, photoresist, optics</li>
            <li>Labspace: workbenches, 3D printers, laser cutters</li>
          </ul>
        </div>
      </section>

      <section id="team">
        <div class="card">
          <h2>Team</h2>
          <p class="muted">Student leads and contributors listed in the deck. Key names include Shaashvat Sekhar, Suchet Gopal, Dhriti Maniar, Devavrat Patni, Abhineet Agarwal, Kartik U C, and Aryamman Bhatia. fileciteturn0file0</p>
        </div>
      </section>

      <section id="get-involved">
        <div class="card">
          <h2>Get involved</h2>
          <p class="muted">We welcome students, faculty mentors, equipment donations, and collaboration with institutes. To participate, contact the team below or download the pitch deck. fileciteturn0file0</p>
          <p style="margin-top:10px"><a class="btn" href="#download">Download Pitch Deck (PDF)</a></p>
        </div>
      </section>

      <section id="download">
        <div class="card">
          <h2>Download</h2>
          <p class="muted">You uploaded a PDF pitch deck; download it here (local copy on your machine). If you want, I can embed pages as images or include extracts on the site.</p>
          <p class="muted pdf">File: Copy of General HackerFab pitch deck.pdf. (Uploaded by user.) fileciteturn0file0</p>
          <p class="muted">To add the PDF to the GitHub Pages site: upload the PDF file into the same repository and link to it, e.g., <code>/Copy%20of%20General%20HackerFab%20pitch%20deck.pdf</code>.</p>
        </div>
      </section>

      <section id="contact">
        <div class="card">
          <h2>Contact</h2>
          <p class="muted">Primary contact: <strong>HackerFab Team, IITB</strong></p>
          <p class="muted">Email: <a href="mailto:you@example.com">you@example.com</a> — replace with real contact details before publishing.</p>
        </div>
      </section>

    </main>

    <footer>
      <div class="muted">This website was generated from the uploaded pitch deck. To customize content, edit this file and push to GitHub. fileciteturn0file0</div>
    </footer>
  </div>
</body>
</html>
