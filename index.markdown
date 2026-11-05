---
layout: default
description: "Developer in Oslo working on Bitcoin, self-hosted software, and practical tools."
---

<div class="home">
  <section class="home-hero" aria-labelledby="home-title">
    <p class="home-eyebrow">Andreas Schjønhaug</p>
    <h1 id="home-title">Developer in Oslo working on Bitcoin, self-hosted software, and practical tools.</h1>
    <p class="home-intro">I build open-source software and write about Bitcoin, privacy, and development.</p>
    <div class="home-actions">
      <a class="button-link" href="/articles/">Read articles</a>
      <a class="text-link" href="/projects/">View projects</a>
    </div>
  </section>

  <section class="home-section" aria-labelledby="about-title">
    <div class="section-heading-row">
      <h2 id="about-title">About</h2>
    </div>
    <div class="home-about">
      <p>I’m a senior developer and technical leader in Oslo, with more than 20 years of experience. Since December 2014 I have run my own company, Schjønhaug AS. My work since then includes iOS and Android apps for NorgesGruppen (Trumf, Joker, Kiwi, Meny and Spar), Posten, Kahoot!, NRK, Sector Alarm and Encap Security.</p>
      <p>I also build Bitcoin and Lightning software and work with AI agents and automation. This site is where I write about it and keep a list of my open-source projects.</p>
      <p>You can reach me at <a href="mailto:{{ site.email }}">{{ site.email }}</a>, on <a href="https://github.com/schjonhaug">GitHub</a> or on <a href="https://x.com/schjonhaug">X</a>. For work with Schjønhaug AS, see <a href="https://www.schjonhaug.com/">schjonhaug.com</a>.</p>
    </div>
  </section>

  <section class="home-section" aria-labelledby="latest-articles-title">
    <div class="section-heading-row">
      <h2 id="latest-articles-title">Latest articles</h2>
      <a class="section-link" href="/articles/">All articles</a>
    </div>
    <ol class="article-list">
      {% assign shown_posts = 0 %}
      {% for post in site.posts %}
        {% unless post.redirect_to %}
          {% if shown_posts < 3 %}
            <li class="article-list-item">
              <time class="post-meta" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
              <h3><a class="article-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a></h3>
              {% if post.description and post.description != "" %}
                <p class="article-description">{{ post.description | escape }}</p>
              {% endif %}
            </li>
            {% assign shown_posts = shown_posts | plus: 1 %}
          {% endif %}
        {% endunless %}
      {% endfor %}
    </ol>
  </section>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "{{ site.url }}/#person",
    "name": {{ site.author.name | jsonify }},
    "url": "{{ site.url }}/",
    "email": {{ site.email | jsonify }},
    "jobTitle": "Senior Developer and Technical Leader",
    "worksFor": {
      "@type": "Organization",
      "name": "Schjønhaug AS",
      "url": "https://www.schjonhaug.com/"
    },
    "description": {{ site.description | strip | jsonify }},
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Oslo",
      "addressCountry": "NO"
    },
    "sameAs": {{ site.social.links | jsonify }}
  }
  </script>
</div>
