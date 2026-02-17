import axios from 'axios';
import { NODE_ENV } from '@/config';
import { isEmpty } from 'lodash';

/**
 * Get member public(no M2M used) info from members API
 * @param member_id
 * @returns Promise
 */
export async function getMemberInfo(member_id: string) {
  return axios
    .get(`https://api.topcoder${NODE_ENV === 'development' ? '-dev' : ''}.com/v6/members?userId=${member_id}`)
    .then(res => (isEmpty(res.data) ? null : res.data[0]));
}

/**
 * Get member public(no M2M used) info from members API
 * @param handle
 * @returns Promise
 */
export async function getMemberInfoByHandle(handle: string) {
  return axios.get(`https://api.topcoder${NODE_ENV === 'development' ? '-dev' : ''}.com/v6/members/${handle}`).then(res => res.data);
}
