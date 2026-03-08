export default {
  async fetch(request) {
    const originalUrl = new URL(request.url);
    const nasDomain = "nas.hyzx.top:5000"; // <--- 替换为你的真实M1域名
    const nasUrl = `http://${nasDomain}${originalUrl.pathname}${originalUrl.search}`;

    const nasRequest = new Request(nasUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    try {
      const response = await fetch(nasRequest);
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("x-proxied-by", "ESA-IPv6-Proxy");
      return newResponse;
    } catch (error) {
      return new Response("Error accessing NAS via ESA Proxy: " + error.message, {
        status: 502,
        statusText: "Bad Gateway",
      });
    }
  },
};
