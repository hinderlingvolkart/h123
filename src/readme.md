# h①②③ – Accessibility HTML5 Outliner

See the headings like a screenreader!

## Add to your bookmarks

[Show Headings][1]

[h①②③][1]
[H1️⃣2️⃣3️⃣][1]
[h❶❷❸][1]

## Why you should

If you are a web developer, you might have heard of sectioning content. Those were introduced with article, nav, section and such to provide a scope for headings and footers. They allowed to semantically structure an HTML document.

    <h1>I am a document</h1>
    <section>
      <h1>I am a section</h1>
      <p>A great section really!</p>
      <aside>
        <h1>Some advertising in between</h1>
        <a href="https://www.chocoloco.com">
          <img 
            src="advertising-animated.gif" 
            alt="Some fancy sweet chocolate drink"
            >
        </a>
      </aside>
      <p>Still belong to the section</p>
    </section>
    <section>
      <h1>Another section</h1>
      <p>And more content for the people</p>
    </section>

The main reason web developers embraced this change was a very practical one: it solved an annoying issue with the heading hierarchy. You'd always had to number the headings h1, h2 etc. imagine a teaser component. Now let's place this teaser into the body, but also into an accordeon. The heading now has to change depending on its place, because the accordion is some levels deeper. This is a nightmare for modular system. So that's why devs loved those h1 in sections.

But reality turned out to be different. While devs embraced the news, browsers and screenreaders (and most probably SEOs) did not: they sticked to the yet existing model. A document full of h1 (well structured within sectioning elements) is total rubbish for a blind user, denying him or her the most important navigational help. The above example has this structure:

1. I am a document
2. I am a section
3. Some advertising in between
4. Another section

The new HTML 5.2 spec takes a step back and now recommends to always set your h1, h2, h3 etc. according the actual level. For accessibility reasons though, you should rely on implicit sectioning at all: forget about sections and you're all set with screenreaders (and probably search engines too).

    <h1>I am a document</h1>
    <section>
      <h2>I am a section</h2>
      <p>A great section really!</p>
      <aside>
        <h2>Some advertising in between</h2>
        <a href="https://www.chocoloco.com">
          <img 
            src="advertising-animated.gif" 
            alt="Some fancy sweet chocolate drink"
            >
        </a>
      </aside>
      <h2>I am a section (continue)</h2>
      <p>Still belong to the section</p>
    </section>
    <section>
      <h2>Another section</hh21>
      <p>And more content for the people</p>
    </section>

Thing is that many people don't know. Some outliners show the structure of the whole document, including hidden parts. But guess what, screenreaders only read what's visible. Yeah, funny thing, right. If you think about it, it makes just sense though. So this outliner will only consider headings that are actually visible, at least visible to the screenreader. (because you can visually hide elements that stay theoretically visible).

Our bookmarklet to the rescue!! :-)


[1]: {{bookmarklet}}
