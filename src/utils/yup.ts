import { addMethod, string } from 'yup';

addMethod(
  string,
  'maxCount',
  function (count: number, message = `\${path} must be within ${count} words`) {
    return this.test('max-word-count', message, (value = '') => {
      return value?.split(/[ ]+/g).length <= count;
    });
  }
);

addMethod(
  string,
  'minCount',
  function (
    count: number,
    message = `\${path} must have at least ${count} words`
  ) {
    return this.test('min-word-count', message, (value = '') => {
      return value?.split(/[ ]+/g).length >= count;
    });
  }
);
