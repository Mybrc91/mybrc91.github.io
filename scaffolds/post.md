---
title: {{ title }}
date: {{ date }}
tags:
categories:
---


{% codeblock %}
alert('Hello World!');
{% endcodeblock %}

{% for link in site.data.menu %}
  <a href="{{ link }}">{{ loop.key }}</a>
{% endfor %}