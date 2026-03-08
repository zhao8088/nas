export default {
  async fetch(request) {
    const originalUrl = new URL(request.url);
    const nasDomain = "m1.example.com"; // 只写域名，不带端口

    // 动态构建回源URL，协议和端口都留空，让平台规则决定
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
