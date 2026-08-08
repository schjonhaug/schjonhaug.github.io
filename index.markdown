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
</div>
