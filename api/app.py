from flask import Flask, request, jsonify, render_template
import math

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/jogo_milhao_edos')
def jogo_milhao_edos():
    return render_template('jogo_milhao_edos.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        initial_population = float(request.form['initial_population'])
        growth_rate = float(request.form['growth_rate']) / 100
        time = float(request.form['time'])

        if initial_population <= 0  or time <= 0:
            return jsonify({'error': 'Valores Inválidos.'}), 400

        population = initial_population * math.exp(growth_rate * time)
        return jsonify({'population': population}), 200
    except ValueError:
        return jsonify({'error': 'Valores Inválidos.'}), 400


if __name__ == '__main__':
    app.run(debug=True)

