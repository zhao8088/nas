export default {
  async fetch(request) {
    const originalUrl = new URL(request.url);
    const nasDomain = "nas.hyzx.top"; // 请替换为您的真实 M1 域名，不带端口

    // 构建目标 URL，使用 http 协议
    const nasUrl = `http://${nasDomain}${originalUrl.pathname}${originalUrl.search}`;

    // 关键修改：直接使用原始请求的 headers，不再强制设置 Host
    const nasRequest = new Request(nasUrl, {
      method: request.method,
      headers: request.headers,  // Host 头此时是 M2 域名，等待规则改写
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
