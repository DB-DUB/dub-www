import request from '@/utils/request'
import { PrankInfo, PrankQuestion } from './model/question'

export function getQuestionConfig(id: string) {
  const questionDomain = import.meta.env.VITE_CONFIG_DOMAIN
  return request({
    url: `${questionDomain}/questions/${id}.json`,
    method: 'get'
  })
}

/**
 * prank-view
 * @param id
 * @returns
 */
export function getTopicView(id: string): Promise<PrankQuestion> {
  return request({
    url: `/prank/topic_view?id=${id}`,
    method: 'get'
  })
}

/**
 * Get the list of pranks
 * @param pos
 * @param limit
 * @returns
 */
export function getPrankList(pos: number, limit: number): Promise<PrankInfo> {
  return request({
    url: `/prank/list?pos=${pos}&limit=${limit}`,
    method: 'get'
  })
}

/**
 * open prank get Reward
 * @param id prank ID
 * @returns
 */
export function openPrank(id: string) {
  return request({
    url: `/prank/topic_open`,
    method: 'post',
    data: { id }
  })
}
