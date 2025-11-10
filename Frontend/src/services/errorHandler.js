
export const handleApiError = (error) => {
  if (!error) {
    return 'An unknown error occurred';
  }


  if (error.code === 'NETWORK_ERROR') {
    return 'Network connection failed. Please check your internet connection.';
  }


  if (error.message) {

    if (typeof error.message === 'string' && error.message.includes(':')) {
      const parts = error.message.split(':');
      if (parts.length > 1) {
        return parts[1].trim();
      }
    }
    return error.message;
  }


  switch (error.status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'Unauthorized. Please log in.';
    case 403:
      return 'Forbidden. You do not have permission to perform this action.';
    case 404:
      return 'Resource not found.';
    case 500:
      return 'Internal server error. Please try again later.';
    default:
      return `An error occurred (${error.status || 'unknown'}). Please try again.`;
  }
};


export const formatError = (error) => {
  const message = typeof error === 'string' ? error : handleApiError(error);
  
  return {
    message,
    type: 'error',
    timestamp: new Date().toISOString()
  };
};

export default {
  handleApiError,
  formatError
};