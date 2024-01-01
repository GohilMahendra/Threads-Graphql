export const extractHashtags=(paragraph:string)=> {
    const hashtagRegex = /#[^\s,#]+/g;
    const paragraphWithoutNewlines = paragraph.replace(/\n/g, ' ');
    const matches = paragraphWithoutNewlines.match(hashtagRegex);
    return matches ? matches : [];
  }