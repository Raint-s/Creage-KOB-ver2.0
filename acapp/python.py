import os

if __name__ == "__main__":
    dir_path = os.path.join(os.getcwd(), os.path.join("dist", "js"))
    for file in os.listdir(dir_path):
        if file[-1] == "s":
            file_path = os.path.join(dir_path, file)
            lines = []
            with open(file_path, encoding='utf-8') as f:
                lines = f.readlines()

            k = lines[0].find("function(")
            lines[0] = "const myfunc = " + lines[0][0:k + 9] + "myappid" + lines[0][k + 9:]

            lines[-2] = lines[-2].replace('"#app"', "myappid")
            i = lines[-2].rfind("()")
            lines[-2] = lines[-2][0:i] + lines[-2][i + 2:]

            lines.append("""

export class Game {
  constructor(id, AcWingOS) {
    const myappid = '#' + id;
    myfunc(myappid);
  }
}""")
            with open(file_path, 'w', encoding='utf-8') as f:
                for line in lines:
                    f.write(line)