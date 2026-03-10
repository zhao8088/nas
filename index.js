export default {
  async fetch(request) {
    const originalUrl = new URL(request.url);
    const nasDomain = "nas.hyzx.top"; // 替换为实际M1域名

    // 构建目标URL，使用http://，不指定端口
    const nasUrl = `http://${nasDomain}${originalUrl.pathname}${originalUrl.search}`;

    // 关键：构造新请求，强制设置Host头
    const nasRequest = new Request(nasUrl, {
      method: request.method,
      headers: {
        ...request.headers,
        'Host': nasDomain,
      },
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
