#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re

# Patrón para detectar 'mala práctica' muy simple:
# En este ejemplo, definimos como "bad code" (malo) cualquier:
# - Uso de console.log en producción
# - Comentarios con "TODO" o "FIXME"
# - Functions con más de 30 líneas (superficialmente)

BAD_PATTERNS = [
    r'\bconsole\.log\(',   # uso de console.log(
    r'TODO',               # comentarios con TODO
    r'FIXME'               # comentarios con FIXME
]

MAX_FUNCTION_LINES = 30  # Umbral arbitrario para definir funciones "demasiado largas"

# Extensiones que consideramos relevantes para un proyecto Ionic
RELEVANT_EXTENSIONS = ('.ts', '.js', '.html', '.css', '.scss')

def count_bad_lines_in_file(file_path):
    """
    Analiza un archivo y devuelve:
      - cantidad de líneas "problemáticas" según BAD_PATTERNS
      - número de funciones 'demasiado grandes' (heurística)
      - cantidad total de líneas
    """
    if not os.path.exists(file_path):
        return 0, 0, 0

    bad_line_count = 0
    total_lines = 0
    large_function_count = 0

    # Expresiones regulares para detectar funciones en JS/TS de forma básica
    # (Puede variar muchísimo dependiendo del estilo de tu proyecto)
    function_start_pattern = re.compile(r'(function\s+\w+|\b\w+\s*=\s*\(.*?\)\s*=>|^\s*[\w]+\s*\([^)]*\)\s*\{)', re.MULTILINE)

    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    # Contar líneas "malas" por regex
    for line in lines:
        total_lines += 1
        # Chequeamos cada patrón 'malo'
        for pattern in BAD_PATTERNS:
            if re.search(pattern, line):
                bad_line_count += 1
                break  # para no contar más de 1 patrón por línea

    # Detectar funciones demasiado largas:
    # -> se realizará una cuenta de líneas entre '{' y '}' de cada función
    file_content = ''.join(lines)
    function_starts = function_start_pattern.finditer(file_content)

    # Guardamos índices donde "empieza" una función
    function_indices = [match.start() for match in function_starts]

    # Heurística simplificada para contar líneas de cada función
    for idx in range(len(function_indices)):
        start_index = function_indices[idx]
        if idx < len(function_indices) - 1:
            end_index = function_indices[idx + 1]
            function_code = file_content[start_index:end_index]
        else:
            function_code = file_content[start_index:]

        # contamos cuántas líneas tiene el bloque
        function_lines = function_code.count('\n')
        if function_lines > MAX_FUNCTION_LINES:
            large_function_count += 1

    # Sumamos al contador de líneas malas, cada función grande
    # (en este ejemplo consideramos cada función grande como "1 línea mala extra")
    bad_line_count += large_function_count

    return bad_line_count, large_function_count, total_lines

def analyze_ionic_project(root_directory):
    """
    Recorre todas las carpetas de un proyecto Ionic y
    calcula un reporte muy básico de la calidad de código.
    """
    total_bad_lines = 0
    total_code_lines = 0
    file_reports = []

    for root, dirs, files in os.walk(root_directory):
        for file in files:
            file_ext = os.path.splitext(file)[1]
            if file_ext.lower() in RELEVANT_EXTENSIONS:
                file_path = os.path.join(root, file)
                bad_lines, large_fns, lines = count_bad_lines_in_file(file_path)
                total_bad_lines += bad_lines
                total_code_lines += lines

                file_reports.append({
                    'file': file_path,
                    'bad_lines': bad_lines,
                    'large_functions': large_fns,
                    'total_lines': lines
                })

    return file_reports, total_bad_lines, total_code_lines

def main():
    # Directorio raíz del proyecto Ionic a analizar
    # Podrías cambiarlo a sys.argv[1] si quieres pasarlo como parámetro
    root_directory = "./"

    print(f"Analizando proyecto en: {root_directory}")

    file_reports, total_bad_lines, total_code_lines = analyze_ionic_project(root_directory)

    # Evitamos división por cero
    if total_code_lines == 0:
        print("No se encontraron líneas de código.")
        return

    # Calculamos el porcentaje
    bad_code_percentage = (total_bad_lines / total_code_lines) * 100
    good_code_percentage = 100 - bad_code_percentage

    print("===== INFORME DE CALIDAD DE CÓDIGO =====")
    print(f"Total líneas analizadas: {total_code_lines}")
    print(f"Líneas 'malas': {total_bad_lines}")
    print(f"Porcentaje de 'código malo': {bad_code_percentage:.2f}%")
    print(f"Porcentaje de 'código bueno': {good_code_percentage:.2f}%")
    print("========================================")

    # Si deseas un detalle por archivo, puedes imprimir file_reports:
    # for report in file_reports:
    #     print(f"- {report['file']}: "
    #           f"Malas: {report['bad_lines']}, "
    #           f"Grandes funciones: {report['large_functions']}, "
    #           f"Total líneas: {report['total_lines']}")

if __name__ == "__main__":
    main()
