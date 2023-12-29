export const extractHashtags=(paragraph:string)=> {
    // Use a regular expression to find words containing hashtags
    const hashtagRegex = /#[^\s,#]+/g;
  
    // Replace newline characters with spaces to ensure proper matching
    const paragraphWithoutNewlines = paragraph.replace(/\n/g, ' ');
  
    // Extract matches from the modified paragraph
    const matches = paragraphWithoutNewlines.match(hashtagRegex);
  
    // If there are matches, return the array of hashtags, otherwise return an empty array
    return matches ? matches : [];
  }