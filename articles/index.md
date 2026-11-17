---
layout: page
title: Articles
description: "Articles about Bitcoin, privacy, self-hosted software, and development."
permalink: /articles/
image:
  path: "/assets/social/articles.jpeg"
  width: 1200
  height: 630
  alt: "Articles by Andreas Schjønhaug about Bitcoin, privacy, self-hosted software, and development"
---

<p class="page-intro">Long-form articles about Bitcoin, privacy, self-hosted software, and development. They are in English and go back to 2020, from iOS development to Bitcoin; my Norwegian articles about Bitcoin are published on <a href="https://www.enogtjue.no/">enogtjue.no</a>.</p>

<ol class="article-list article-archive">
  {% for post in site.posts %}
    {% unless post.redirect_to %}
      <li class="article-list-item">
        <time class="post-meta" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
        <h2><a class="article-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a></h2>
        {% if post.description and post.description != "" %}
          <p class="article-description">{{ post.description | escape }}</p>
        {% endif %}
      </li>
    {% endunless %}
  {% endfor %}
</ol>
