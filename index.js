// 定义一个async函数来处理所有进入的请求
async function handleRequest(request) {
  // 获取原始请求的URL
  const originalUrl = new URL(request.url);

  // --- 配置你的NAS域名（通过IPv6访问的那个）---
  const nasDomain = "nas.hyzx.top"; // <--- 将这里替换为你的NAS域名（如 m1.example.com）
  // ------------------------------------------

  // 构建新的URL：协议 + NAS域名 + 原始请求的路径和参数
  const nasUrl = `http://${nasDomain}${originalUrl.pathname}${originalUrl.search}`;

  // 创建一个新的Request对象去访问NAS，并保留原请求的方法、头部和主体（如果是POST等）
  const nasRequest = new Request(nasUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  try {
    // 使用 fetch 从 ESA 边缘节点发起对 NAS 的请求
    const response = await fetch(nasRequest);

    // 创建一个新的Response对象，将NAS的响应返回给用户
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("x-proxied-by", "ESA-IPv6-Proxy");

    return newResponse;
  } catch (error) {
    // 如果请求失败，返回一个友好的错误信息
    return new Response("Error accessing your NAS via ESA Proxy: " + error.message, {
      status: 502,
      statusText: "Bad Gateway",
    });
  }
}

// 监听fetch事件，当有请求到达时，调用handleRequest函数处理
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
