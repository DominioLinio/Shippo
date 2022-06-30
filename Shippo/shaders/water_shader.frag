#version 460 core

in vec3 fragPos;
in vec4 fWaterColor;

out vec4 FragColor;


uniform vec3 light1Color;
uniform vec3 light1Pos;

uniform vec3 light2Color;
uniform vec3 light2Pos;

uniform vec3 viewPos;

vec3 pointLight(vec3 lightPosition, vec3 lightColor, vec3 fragmentPosition, float ambientStrength, float diffuseStrength, float specularStrength, vec3 viewDirection) {
    vec3 lightDirection = normalize(lightPosition - fragmentPosition);

    // Calculate ambient
    vec3 ambient = ambientStrength * lightColor;

    // Calculate diffuse
    vec3 normalizedNormal = normalize(vec3(0.0, 1.0, 0.0));
    float diffuseImpact = max(dot(normalizedNormal, lightDirection), 0.0);
    vec3 diffuse = diffuseStrength * diffuseImpact * lightColor;

    // Calculate specular
    vec3 reflectDirection = reflect(-lightDirection, normalizedNormal);
    float specularImpact = pow(max(dot(viewDirection, reflectDirection), 0.0), 32);
    vec3 specular = specularStrength * specularImpact * lightColor;

    // Attenuation
    float distance = length(lightPosition - fragmentPosition);
    // For distance = 325
    float constant = 1;
    float linear = 	0.0014;
    float quadratic = 0.000007;
    float attenuation = 1.0 / (constant + linear * distance + quadratic * (distance * distance)); 
    attenuation = 1.0;
    ambient *= attenuation;
    diffuse *= attenuation;
    specular *= attenuation;

    return ambient + diffuse + specular;
}

void main()
{
    vec3 viewDir = normalize(viewPos - fragPos);
    vec3 light1 = pointLight(light1Pos, light1Color, fragPos, 0.3, 1.0, 0.3, viewDir);
    vec3 light2 = pointLight(light2Pos, light2Color, fragPos, 0.3, 1.0, 0.3, viewDir);
    FragColor = vec4(light1 + light2, 1.0) * fWaterColor;
} 

