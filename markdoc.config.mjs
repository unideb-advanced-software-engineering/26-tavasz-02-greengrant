import { component, defineMarkdocConfig } from "@astrojs/markdoc/config";
import starlightMarkdoc from "@astrojs/starlight-markdoc";

const likeC4Component = component("./src/components/LikeC4View.astro");

export default defineMarkdocConfig({
  extends: [starlightMarkdoc()],
  tags: {
    likec4: {
      render: likeC4Component,
      attributes: {
        viewId: {
          type: String,
        },
      },
    },
  },
});