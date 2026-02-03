from flask import Flask, request, jsonify
from flask_cors import CORS
from db import create_tables, register_genres, get_connection

app = Flask(__name__)

# LIBERA ACESSO DO FRONTEND
CORS(app)

# Cria tabelas ao iniciar o servidor
create_tables()

# ============================
# REGISTRAR BUSCA (FRONT → BACK)
# ============================
@app.route("/log-search", methods=["POST"])
def log_search():
    data = request.get_json(silent=True) or {}

    term = data.get("term", "")
    genres = data.get("genres", [])

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO search_logs (term, genres)
        VALUES (?, ?)
    """, (term, ",".join(genres)))

    conn.commit()
    conn.close()

    if genres:
        register_genres(genres)

    return jsonify({"status": "ok"}), 201


# ============================
# RETORNAR DADOS ANALÍTICOS
# ============================
@app.route("/analytics/genres", methods=["GET"])
def analytics_genres():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT genre, count
        FROM genre_usage
        ORDER BY count DESC
    """)

    data = cursor.fetchall()
    conn.close()

    return jsonify([
        {"genre": row[0], "count": row[1]}
        for row in data
    ])


if __name__ == "__main__":
    app.run(debug=True)

# ============================
# LINK PARA TESTES: http://127.0.0.1:5000/analytics/genres
# ============================