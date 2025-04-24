const fs = require('fs');
const path = require('path');

const fetch = require('jest-fetch-mock').enableMocks(); // this mocks fetch globally in this file
console.log('Fetch is:', typeof fetch);


describe('Signup Form UI Tests', () => {
  beforeEach(() => {
    fetch.resetMocks();

    // Load the HTML
    const html = fs.readFileSync(path.resolve(__dirname, '../signup.html'), 'utf8');
    document.documentElement.innerHTML = html;

    // Re-require the JS to attach listeners
    require('../signup.js');
  });

  test('shows alert if fields are empty', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    document.querySelector('form').dispatchEvent(new Event('submit'));

    expect(alertMock).toHaveBeenCalledWith('Please fill in all fields.');
    alertMock.mockRestore();
  });

  test('submits form and redirects on success', async () => {
    fetch.mockResponseOnce(JSON.stringify({ success: true }));

    // Fill in fields
    document.getElementById('inputName').value = 'John';
    document.getElementById('inputEmail1').value = 'john@example.com';
    document.getElementById('exampleInputPassword1').value = '123456';

    // Mock alert and redirect
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    delete window.location;
    window.location = { href: '' };

    await document.querySelector('form').dispatchEvent(new Event('submit'));

    expect(fetch).toHaveBeenCalled();
    expect(window.location.href).toBe('/login.html');

    alertMock.mockRestore();
  });
});
