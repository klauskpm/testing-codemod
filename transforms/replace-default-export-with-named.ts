'use strict';

import {API, FileInfo} from "jscodeshift";

export default function(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let dirtyFlag = false;

  // Find the default export declaration
  root.find(j.ExportDefaultDeclaration).forEach((path) => {
    const declaration = path.node.declaration;

    // Check if the default export is a function declaration
    if (declaration?.id && j.FunctionDeclaration.check(declaration)) {
      // Remove the export default declaration
      j(path).remove();

      // Insert the function declaration without export default
      root.get().node.program.body.unshift(declaration);

      // Add the named export at the end
      root.get().node.program.body.push(
        j.exportNamedDeclaration(null, [
          j.exportSpecifier.from({
            exported: j.identifier(declaration.id.name),
            local: j.identifier(declaration.id.name)
          })
        ])
      );

      dirtyFlag = true;
    }

    // Check if the default export is an identifier
    if (j.Identifier.check(declaration)) {
      const name = declaration.name;

      // Replace the default export with a named export
      j(path).replaceWith(
        j.exportNamedDeclaration(null, [
          j.exportSpecifier.from({
            exported: j.identifier(name),
            local: j.identifier(name),
          }),
        ]),
      );
      dirtyFlag = true;
    }
  });

  return dirtyFlag ? root.toSource() : undefined;
}