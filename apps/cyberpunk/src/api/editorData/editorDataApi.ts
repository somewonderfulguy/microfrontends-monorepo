import { request } from '../request';
import { VideoEditor } from './editorDataTypes';
import { editorDataUrl } from './editorDataUrls';

export const getEditorData = () => request<VideoEditor>(editorDataUrl);
