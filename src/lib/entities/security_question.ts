export interface SecurityQuestion {
  id: string
  /**
   * The text of the security question shown to the user.
   */
  question: string
  /**
   * Indicates whether the answer can be purely numeric.
   * "T" (true) or "F" (false) as returned by IBKR API.
   */
  canBeNumber: 'T' | 'F'
  /**
   * Minimum required answer length represented as a string in the API response.
   */
  minAnswerLength: string
  /**
   * Maximum number of times a single character can be repeated consecutively in the answer.
   */
  maxRepeatableCharsCount: string
}

export interface SecurityQuestionsResponse {
  /**
   * Constant literal identifying the enumeration set. Always "security-questions" for this endpoint.
   */
  enumerationsType: 'security-questions'
  /**
   * Array of security questions available to the user.
   */
  jsonData: SecurityQuestion[]
}
