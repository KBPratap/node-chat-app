const expect = require('expect');

const { generateMessage } = require('./message');

describe('generateMessage', () => {

    it('should generate correct message object', () => {
        let from = 'kbp';
        let text = 'I\'m testing generateMessage util';
        
        let message =  generateMessage(from, text)

        expect(message.from).toBe(from);
        expect(message.text).toBe(text);
        expect(typeof message.createdAt).toBe('number');
    })
})