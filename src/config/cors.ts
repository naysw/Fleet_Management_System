import { CLIENT_ID, CLIENT_SECRET } from './constants';

/**
 * cors options
 *
 * @type
 */
export default {
  /**
   * allow methods
   */
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

  /**
   * allow headers
   */
  allowedHeaders: [
    'Content-Type',
    'Accept',
    'Authorization',
    CLIENT_ID,
    CLIENT_SECRET,
  ],

  /**
   * allow origin
   */
  origin: '*',

  /**
   *
   */
  preflightContinue: false,
};
