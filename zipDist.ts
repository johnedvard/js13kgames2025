import { createWriteStream } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import archiver from "archiver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const output = createWriteStream(join(__dirname, "triska.zip"));

const archive = archiver("zip", {
  zlib: { level: 9 }, // Sets the compression level.
});

output.on("close", () => {
  console.log(`${archive.pointer()} total bytes`);
  console.log(
    "archiver has been finalized and the output file descriptor has closed."
  );
});

output.on("end", () => {
  console.log("Data has been drained");
});

archive.on("warning", (err: any) => {
  if (err.code !== "ENOENT") {
    throw err;
  }
});

archive.on("error", (err: any) => {
  throw err;
});

archive.pipe(output);

archive.directory("dist", false);

archive.finalize();
