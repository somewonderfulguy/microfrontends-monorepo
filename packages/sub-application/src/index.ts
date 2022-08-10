/**
 * Importing './indexReal' is a needed step for the projects that used Module Federation
 * If you don't do this your application will fail to boot and complain in the console about not 
 * being able to eagerly load a dependency. 
 * 
 * What this does is give Webpack some “breathing room” to be able to 
 * asynchronously load any dependencies required by Module Federation.
 */

import('./indexReal');
export {};