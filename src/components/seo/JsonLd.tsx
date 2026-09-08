import React from "react";

type Props = {
  /** a schema.org node — passed straight through as ld+json */
  data: Record<string, unknown>;
};

/* structured data is invisible markup, so it is safe to inject as a script.
   the payload is built in our own code, never from user input. */
const JsonLd = ({ data }: Props) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export default JsonLd;
