/* eslint-disable func-names */
/* eslint-disable no-cond-assign */
import { HTTP } from 'meteor/http';
import logger from '../../logger';

function doRequest({ url, method, options = {} }) {
  logger.debug('doRequest called', { url, method, options });

  try {
    const result = HTTP.call(method, url, options);
    return { result, error: null };
  } catch (error) {
    if (error.response && error.response.statusCode && error.response.statusCode === 403) {
      return { error: 'Forbidden', result: null };
    }
    if (error.response && error.response.statusCode && error.response.statusCode === 500) {
      return { error: 'Forbidden', result: null };
    }
    if (error.response && error.response.statusCode && error.response.statusCode === 503) {
      return { error: 'Forbidden', result: null };
    }
    return { error: 'HTTP error', result: null };
  }
}

function convertQuery(params) {
  const url = Object.keys(params)
    .map(function(k) {
      return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
    })
    .join('&');
  return url;
}

function extractRegex({ regex, str }) {
  const usedRegex = regex;
  let m = usedRegex.exec(str);
  const result = [];
  while (m !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === usedRegex.lastIndex) {
      usedRegex.lastIndex += 1;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach(match => {
      if (result.indexOf(match.replace(/['|"]*/g, '')) === -1)
        result.push(match.replace(/['|"]*/g, ''));
    });
    m = usedRegex.exec(str);
  }
  return result;
}

function countTextOcurrences({ regex, str }) {
  const usedRegex = regex;
  // let m = usedRegex.exec(str)
  let result = 0;
  while (usedRegex.exec(str)) {
    result += 1;
  }
  // while (m !== null) {
  //   // This is necessary to avoid infinite loops with zero-width matches
  //   if (m.index === usedRegex.lastIndex) {
  //     usedRegex.lastIndex += 1
  //   }
  //
  //   // The result can be accessed through the `m`-variable.
  //   m.forEach((match, groupIndex) => {
  //     console.log(`Found match, group ${groupIndex}: ${match}`)
  //     if (result.indexOf(match.replace(/['|"]*/g, '')) === -1)
  //       result.push(match.replace(/['|"]*/g, ''))
  //   })
  //   m = usedRegex.exec(str)
  // }
  return result;
}

export default { doRequest, convertQuery, extractRegex, countTextOcurrences };
