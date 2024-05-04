interface Config extends RequestInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  headers?: HeadersInit & { Authorization?: string };
}

const request = <TReturnValue>(
  endpoint: string,
  { body, ...customConfig }: Config = {}
): Promise<TReturnValue> => {
  const isFormData = body instanceof FormData;

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...customConfig.headers
    }
  };

  if (body) config.body = isFormData ? body : JSON.stringify(body);

  return fetch(endpoint, config).then(async (response) => {
    let data;

    if (response.status === 401) {
      console.error('Unauthorized');
    }

    try {
      // handle empty success response
      if (
        response.status === 200 &&
        response.headers.get('Content-Type') == null
      ) {
        return;
      }

      if (
        response.headers
          .get('Content-Type')
          ?.includes('application/octet-stream')
      ) {
        const blob = await response.blob();
        const contentDisposition = response.headers.get('Content-Disposition');

        if (contentDisposition && contentDisposition.includes('filename=')) {
          const fileName = contentDisposition
            .split('filename=')[1]
            .split(';')[0];
          data = new File([blob], fileName);
        } else {
          data = blob;
        }
      } else if (response.headers.get('Content-Type')?.includes('text/plain')) {
        data = await response.text();
      } else {
        data = await response.json();
      }
    } catch (e) {
      console.error(e);
    }

    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
};

export { request };
