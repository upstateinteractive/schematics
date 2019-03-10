"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
const core = require("@angular-devkit/core");
const schematics = require("@angular-devkit/schematics");
const ts = require("typescript");
const ast_utils = require("../utility/ast-utils");
const find_module = require("../utility/find-module");
const parse_name = require("../utility/parse-name");
const project = require("../utility/project");
const validation = require("../utility/validation");

const lazyRoute = (options: any) => {
  const route = `{
  path: 'auth',
  loadChildren: './auth/auth.module#AuthModule'
}`;
  if (options.routes) {
    return ', ' + route;
  }
  return route;
};

function addDeclarationToNgModule(options: any) {
    return (host: any) => {
        if (!options.module) {
            return host;
        }
        const parts = options.module.split('.');
        parts[parts.length - 3] += '-routing';
        const modulePath = parts.join('.');
        const text = host.read(modulePath);
        if (text === null) {
            throw new schematics.SchematicsException(`File ${modulePath} does not exist.`);
        }
        const sourceText = text.toString('utf-8');
        const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
        const importModulePath = core.normalize(`/${options.path}/`
            + (options.flat ? '' : core.strings.dasherize(options.name) + '/')
            + core.strings.dasherize(options.name)
            + '.module');
        const relativePath = find_module.buildRelativePath(modulePath, importModulePath);
        ast_utils.addImportToModule(source, modulePath, core.strings.classify(`${options.name}Module`), relativePath);
        const nodes: any[] = ast_utils.findNodes(source, ts.SyntaxKind.Identifier);
        const call = nodes.filter(n => n.text === 'forRoot' || n.text === 'forChild').pop();
        const routes = call.parent.parent.arguments[0];
        const definition = ast_utils.findNodes(source, ts.SyntaxKind.Identifier).filter((s: any) => s.text === routes.text).shift();
        const arr = definition.parent.initializer;
        const pos = arr.getEnd() - 1;
        const recorder = host.beginUpdate(modulePath);
        recorder.insertLeft(pos, lazyRoute(options));
        host.commitUpdate(recorder);
        return host;
    };
}

function buildSelector(options: any, projectPrefix: any) {
    let selector = core.strings.dasherize(options.name);
    if (options.prefix) {
        selector = `${options.prefix}-${selector}`;
    }
    else if (options.prefix === undefined && projectPrefix) {
        selector = `${projectPrefix}-${selector}`;
    }
    return selector;
}

export function lazyLoadRoute(options: any) {
    return (host: any) => {
        const _project = project.getProject(host, options.project);
        if (options.path === undefined) {
            options.path = project.buildDefaultPath(_project);
        }
        if (options.route) {
            options.route = find_module.findModuleFromOptions(host, options);
        }
        const parsedPath = parse_name.parseName(options.path, options.name);
        options.name = parsedPath.name;
        options.path = parsedPath.path;
        options.routing = true;
        options.module = find_module.findModuleFromOptions(host, options);
        options.selector = buildSelector(options, project.prefix);
        validation.validateName(options.name);
        validation.validateHtmlSelector(options.selector);

        const componentTemplateSource = schematics.apply(schematics.url('./files'), [
            options.spec ? schematics.noop() : schematics.filter((path: any) => !path.endsWith('.spec.ts')),
            options.inlineStyle ? schematics.filter((path: any) => !path.endsWith('.__styleext__')) : schematics.noop(),
            options.inlineTemplate ? schematics.filter((path: any) => !path.endsWith('.html')) : schematics.noop(),
            schematics.template(Object.assign({}, core.strings, { 'if-flat': (s: any) => options.flat ? '' : s }, options)),
            schematics.move(parsedPath.path),
        ]);

        return schematics.chain([
            schematics.branchAndMerge(schematics.chain([
                addDeclarationToNgModule(options),
                schematics.mergeWith(componentTemplateSource),
            ])),
        ]);
    };
}