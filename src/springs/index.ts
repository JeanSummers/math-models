import Controller from "@Animations/Controller";
import Scenario from "./Scenario";

const id = 'screen';

const canvas = document.getElementById(id);
if (!canvas || !(canvas instanceof HTMLCanvasElement))
    throw new Error(`Canvas with id ${id} does not found`);

const controller = new Controller(canvas, new Scenario(canvas));

const global = <any>window;
global.controller = controller;