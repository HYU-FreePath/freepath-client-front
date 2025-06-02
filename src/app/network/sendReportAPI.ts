import { apiHandler } from '@/network/apiHandler'

export interface IssuePayload {
  content: string
}

export interface IssueResponse {
  statusCode: boolean
  message: string
  data: Array<string>
  // 필요에 따라 필드 추가
}

export const sendReportAPI = async (
  code: string | undefined,
  payload: IssuePayload
): Promise<IssueResponse> => {
  return apiHandler<IssueResponse>('POST', `/issues/${code}`, payload)
}