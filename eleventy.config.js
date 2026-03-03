export default function(eleventyConfig) {
  // Pass through CSS
  eleventyConfig.addPassthroughCopy("css");

  // Exclude non-content files from build
  eleventyConfig.ignores.add("CLAUDE.md");
  eleventyConfig.ignores.add("docs/**");
  eleventyConfig.ignores.add("node_modules/**");

  // Collections: legs sorted by order
  eleventyConfig.addCollection("legs", function(collectionApi) {
    return collectionApi.getFilteredByTag("leg").sort((a, b) => {
      return (a.data.order || 0) - (b.data.order || 0);
    });
  });

  // Make external links open in a new tab
  eleventyConfig.addTransform("externalLinks", function(content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      return content.replace(
        /<a\s+href="(https?:\/\/[^"]+)"/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer"'
      );
    }
    return content;
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    pathPrefix: "/gulf-coast-tour/"
  };
}
