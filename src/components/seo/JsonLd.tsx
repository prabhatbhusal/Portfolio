import React from "react";

type Props = {
  /** a schema.org node — passed straight through as ld+json */
  data: Record<string, unknown>;
};

/* post titles and tags end up in here, and they come from uploaded files.
   JSON.stringify does not escape "<", so a title containing </script> would
   close this tag and run whatever followed. the json escape for "<" keeps
   the data identical for parsers and inert for the html tokenizer */
const JsonLd = ({ data }: Props) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
  />
);

export default JsonLd;
