import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getEditorData } from './editorDataApi';
import { VideoEditor } from './editorDataTypes';

export const editorDataQueryKey = ['editorData'] as const;
export const useEditorData = (
  options: Omit<
    UseQueryOptions<VideoEditor, unknown>,
    'queryKey' | 'queryFn'
  > = {}
) =>
  useQuery<VideoEditor, unknown>({
    queryKey: editorDataQueryKey,
    queryFn: getEditorData,
    ...options
  });
