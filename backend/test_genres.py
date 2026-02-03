from db import create_tables, register_genres, get_connection

def show_genres():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, genre, count FROM genre_usage ORDER BY count DESC")
    rows = cursor.fetchall()

    print("\nDados na tabela genre_usage:")
    for row in rows:
        print(row)

    conn.close()


if __name__ == "__main__":
    print("Conectando ao banco...")
    create_tables()

    print("\nEstado ANTES do teste:")
    show_genres()

    print("\nInserindo gêneros de teste...")
    test_genres = [
        "Ação",
        "acao",
        "AÇÃO",
        "Aventura",
        "aventura",
        "Drama",
        "drama",
        "Shounen",
        "shounen"
    ]

    register_genres(test_genres)

    print("\nEstado DEPOIS do teste:")
    show_genres()
