plaintext = """
Harry,
I had a look, and I think you were right that it's worth being curious about. I still can't find the paper itself, but I found an old copy of the conference programme through the university library. Ellison's talk was definitely there originally, and it wasn't cancelled until three days after the programme went online.
More interestingly, the conference site briefly had a page for her presentation. The page is still in the archive, although the recording has gone and the link now returns an error. There was a short description of the talk which doesn't appear anywhere on the current site.
I also checked Ellison's university profile. She's still listed as a member of staff, so at least we don't have to start a missing-person investigation yet, but her current project is different from the one on an older version of the page. There used to be a second paper listed there as well. That has disappeared too.
The strange thing is that someone called Daniel Price was listed as working with her on that project. He's a computational linguist, apparently, which seems a little outside Ellison's field. I found one of his papers, though, and it mentions trying to link writing produced by the same person under different names.
That may be completely unrelated, but it made me go back to Ellison's old project description. There's a bibliography attached to it which isn't on the current page.
I've saved a copy before someone changes it again. I'll see what I can find in the references.
Jodie
"""
plaintext = plaintext.strip("\n")

ciphertext = """
SGFycnksCkkgaGFkIGEgbG9vaywgYW5kIEkgdGhpbmsgeW91IHdlcmUgcmlnaHQgdGhhdCBpdCdzIHdvcnRoIGJlaW5nIGN1cmlvdXMgYWJvdXQuIEkgc3RpbGwgY2FuJ3QgZmluZCB0aGUgcGFwZXIgaXRzZWxmLCBidXQgSSBmb3VuZCBhbiBvbGQgY29weSBvZiB0aGUgY29uZmVyZW5jZSBwcm9ncmFtbWUgdGhyb3VnaCB0aGUgdW5pdmVyc2l0eSBsaWJyYXJ5LiBFbGxpc29uJ3MgdGFsayB3YXMgZGVmaW5pdGVseSB0aGVyZSBvcmlnaW5hbGx5LCBhbmQgaXQgd2Fzbid0IGNhbmNlbGxlZCB1bnRpbCB0aHJlZSBkYXlzIGFmdGVyIHRoZSBwcm9ncmFtbWUgd2VudCBvbmxpbmUuCk1vcmUgaW50ZXJlc3RpbmdseSwgdGhlIGNvbmZlcmVuY2Ugc2l0ZSBicmllZmx5IGhhZCBhIHBhZ2UgZm9yIGhlciBwcmVzZW50YXRpb24uIFRoZSBwYWdlIGlzIHN0aWxsIGluIHRoZSBhcmNoaXZlLCBhbHRob3VnaCB0aGUgcmVjb3JkaW5nIGhhcyBnb25lIGFuZCB0aGUgbGluayBub3cgcmV0dXJucyBhbiBlcnJvci4gVGhlcmUgd2FzIGEgc2hvcnQgZGVzY3JpcHRpb24gb2YgdGhlIHRhbGsgd2hpY2ggZG9lc24ndCBhcHBlYXIgYW55d2hlcmUgb24gdGhlIGN1cnJlbnQgc2l0ZS4KSSBhbHNvIGNoZWNrZWQgRWxsaXNvbidzIHVuaXZlcnNpdHkgcHJvZmlsZS4gU2hlJ3Mgc3RpbGwgbGlzdGVkIGFzIGEgbWVtYmVyIG9mIHN0YWZmLCBzbyBhdCBsZWFzdCB3ZSBkb24ndCBoYXZlIHRvIHN0YXJ0IGEgbWlzc2luZy1wZXJzb24gaW52ZXN0aWdhdGlvbiB5ZXQsIGJ1dCBoZXIgY3VycmVudCBwcm9qZWN0IGlzIGRpZmZlcmVudCBmcm9tIHRoZSBvbmUgb24gYW4gb2xkZXIgdmVyc2lvbiBvZiB0aGUgcGFnZS4gVGhlcmUgdXNlZCB0byBiZSBhIHNlY29uZCBwYXBlciBsaXN0ZWQgdGhlcmUgYXMgd2VsbC4gVGhhdCBoYXMgZGlzYXBwZWFyZWQgdG9vLgpUaGUgc3RyYW5nZSB0aGluZyBpcyB0aGF0IHNvbWVvbmUgY2FsbGVkIERhbmllbCBQcmljZSB3YXMgbGlzdGVkIGFzIHdvcmtpbmcgd2l0aCBoZXIgb24gdGhhdCBwcm9qZWN0LiBIZSdzIGEgY29tcHV0YXRpb25hbCBsaW5ndWlzdCwgYXBwYXJlbnRseSwgd2hpY2ggc2VlbXMgYSBsaXR0bGUgb3V0c2lkZSBFbGxpc29uJ3MgZmllbGQuIEkgZm91bmQgb25lIG9mIGhpcyBwYXBlcnMsIHRob3VnaCwgYW5kIGl0IG1lbnRpb25zIHRyeWluZyB0byBsaW5rIHdyaXRpbmcgcHJvZHVjZWQgYnkgdGhlIHNhbWUgcGVyc29uIHVuZGVyIGRpZmZlcmVudCBuYW1lcy4KVGhhdCBtYXkgYmUgY29tcGxldGVseSB1bnJlbGF0ZWQsIGJ1dCBpdCBtYWRlIG1lIGdvIGJhY2sgdG8gRWxsaXNvbidzIG9sZCBwcm9qZWN0IGRlc2NyaXB0aW9uLiBUaGVyZSdzIGEgYmlibGlvZ3JhcGh5IGF0dGFjaGVkIHRvIGl0IHdoaWNoIGlzbid0IG9uIHRoZSBjdXJyZW50IHBhZ2UuCkkndmUgc2F2ZWQgYSBjb3B5IGJlZm9yZSBzb21lb25lIGNoYW5nZXMgaXQgYWdhaW4uIEknbGwgc2VlIHdoYXQgSSBjYW4gZmluZCBpbiB0aGUgcmVmZXJlbmNlcy4KSm9kaWU=
"""
ciphertext = ciphertext.strip("\n")

def encode_ASCII(plaintext):
    # Encodes the plaintext as 8-bit ASCII
    # The first bit will always be 0 however it means each character is 1 byte
    encoded = ""
    for char in plaintext:
        char_code = ord(char) # convert character to ASCII code
        char_binary = format(char_code, '08b')  # Convert to 8-bit binary
        encoded += char_binary + " "
    return encoded.strip()

def encode_Base64(plaintext):
    encoded = ""
    bits = encode_ASCII(plaintext).replace(" ", "")  # Get binary string without spaces

    original_byte_length = len(bits) // 8  # Store the length of the original bytes to use later for '=' padding

    # Base 64 requires 6 bits per character, so we need to pad the binary string to a multiple of 6
    while len(bits) % 6 != 0:
        bits += "0"  # Pad with zeros

    base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    for i in range(0, len(bits), 6):
        six_bit_block = bits[i:i+6]  # Get block of 6 bits
        decimal_value = int(six_bit_block, 2)  # Convert binary to decimal
        encoded += base64_chars[decimal_value]  # Map to Base64 character (0 -> A, 1 -> B, ..., 63 -> /)

    # Add padding if necessary
    padding = (3 - (original_byte_length % 3)) % 3
    encoded += "=" * padding
    
    return encoded

def decode_ASCII(encoded):
    decoded = ""
    encoded = encoded.replace(" ", "")  # Remove spaces to force 8-bit blocks
    for i in range(0, len(encoded), 8):
        char_binary = encoded[i:i+8]  # Get block of 8 bits
        char_code = int(char_binary, 2)  # Convert binary to integer
        decoded += chr(char_code)  # Convert ASCII code to character
    return decoded

def decode_Base64(encoded):
    decoded = ""
    bits = ""
    base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    for char in encoded:
        if char == "=":
            continue  # Skip padding characters
        decimal_value = base64_chars.index(char)  # Get the index of the Base64 character (0 -> A, 1 -> B, ..., 63 -> /)

        bits += format(decimal_value, '06b')  # Convert to 6-bit binary

    # Now decode the binary string back to ASCII
    for i in range(0, len(bits), 8):
        char_binary = bits[i:i+8]  # Get block of 8 bits
        if len(char_binary) < 8:
            break  # Ignore incomplete blocks at the end
        char_code = int(char_binary, 2)  # Convert binary to integer
        decoded += chr(char_code)  # Convert ASCII code to character

    return decoded


print(encode_Base64(plaintext))

print()

print(decode_Base64(ciphertext))