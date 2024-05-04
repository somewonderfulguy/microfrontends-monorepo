import { rest } from 'msw';

import { editorDataMock } from './editorDataMock';
import { VideoEditor } from './editorDataTypes';
import { editorDataUrl } from './editorDataUrls';

const editorDataMSW = rest.get(editorDataUrl, (req, res, context) => {
  return res(context.status(200), context.json<VideoEditor>(editorDataMock));
});

export const editorDataHandlers = [editorDataMSW];
