from flask import Flask, jsonify, request
from soal1 import nomor_1_run

app = Flask(__name__)

@app.route('/soal_1', methods=['POST'])
def nomor_1():
    data = request.json

    svg1, svg2 = nomor_1_run(data)

    return jsonify({'result1': f'{svg1}', 'result2': f'{svg2}'})

if __name__ == '__main__':
    app.run(debug=True)
