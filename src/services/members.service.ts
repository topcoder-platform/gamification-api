import axios from 'axios';
import { NODE_ENV } from '@/config';
import { isEmpty } from '@utils/util';

/**
 * Get member public(no M2M used) info from members API
 * @param member_id
 * @returns Promise
 */
export async function getMemberInfo(member_id: string) {
  const userId = encodeURIComponent(member_id);
  return axios
    .get(`https://api.topcoder${NODE_ENV === 'development' ? '-dev' : ''}.com/v6/members?userId=${userId}`)
    .then(res => (isEmpty(res.data) ? null : res.data[0]));
}

/**
 * Get member public(no M2M used) info from members API
 * @param handle
 * @returns Promise
 */
export async function getMemberInfoByHandle(handle: string) {
  const encodedHandle = encodeURIComponent(handle);
  return axios.get(`https://api.topcoder${NODE_ENV === 'development' ? '-dev' : ''}.com/v6/members/${encodedHandle}`).then(res => res.data);
}
